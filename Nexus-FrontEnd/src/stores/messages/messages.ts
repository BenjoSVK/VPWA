import { defineStore } from 'pinia'
import { messagesApi, realtimeClient, type Message } from 'src/lib/api'
import { useAuthStore } from '../auth/auth'
import { useChannelsStore } from '../channels/channels'
import { useUserStatusStore } from '../user/userStatus'
import { PAGINATION, NOTIFICATION } from 'src/lib/constants'
import { getErrorMessage } from 'src/lib/errorHandler'

interface MessagesState {
  messagesByChannel: Map<number, Message[]>
  loading: boolean
  hasMore: Map<number, boolean>
  currentSubscriptionChannelId: number | null
}

export const useMessagesStore = defineStore('messages', {
  state: (): MessagesState => ({
    messagesByChannel: new Map(),
    loading: false,
    hasMore: new Map(),
    currentSubscriptionChannelId: null
  }),

  getters: {
    currentMessages: (state) => {
      const channels = useChannelsStore()
      if (!channels.selectedId) return []
      return state.messagesByChannel.get(channels.selectedId) ?? []
    },

    hasMoreMessages: (state) => {
      const channels = useChannelsStore()
      if (!channels.selectedId) return false
      return state.hasMore.get(channels.selectedId) ?? true
    }
  },

  actions: {
    async fetchMessages(channelId: number, loadMore = false) {
      const auth = useAuthStore()
      if (!auth.currentUserId) return []

      this.loading = true

      try {
        const currentMessages = this.messagesByChannel.get(channelId) ?? []
        const page = loadMore ? Math.ceil(currentMessages.length / PAGINATION.MESSAGES_PER_PAGE) + 1 : 1

        const response = await messagesApi.list(channelId, page, PAGINATION.MESSAGES_PER_PAGE)

        if (loadMore) {
          this.messagesByChannel.set(channelId, [...response.data, ...currentMessages])
        } else {
          this.messagesByChannel.set(channelId, response.data)
        }

        this.hasMore.set(channelId, response.meta.currentPage < response.meta.lastPage)

        return response.data
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching messages:', error)
        }
        return []
      } finally {
        this.loading = false
      }
    },

    async sendMessage(content: string): Promise<{ success: boolean; error?: string; message?: Message }> {
      const auth = useAuthStore()
      const channels = useChannelsStore()
      const userStatus = useUserStatusStore()

      if (!auth.currentUserId || !channels.selectedId) {
        return { success: false, error: 'Not authenticated or no channel selected' }
      }

      if (userStatus.isOffline) {
        return { success: false, error: 'Cannot send messages while offline' }
      }

      try {
        const message = await messagesApi.send(channels.selectedId, content)

        const currentMessages = this.messagesByChannel.get(channels.selectedId) ?? []
        this.messagesByChannel.set(channels.selectedId, [...currentMessages, message])

        return { success: true, message }
      } catch (error) {
        return { success: false, error: getErrorMessage(error) }
      }
    },

    setupRealtimeSubscription(channelId: number) {
      const auth = useAuthStore()
      const userStatus = useUserStatusStore()

      if (this.currentSubscriptionChannelId && this.currentSubscriptionChannelId !== channelId) {
        realtimeClient.stopPolling()
      }

      if (this.currentSubscriptionChannelId === channelId) {
        return
      }

      this.currentSubscriptionChannelId = channelId

      if (userStatus.isOffline) {
        return
      }

      const currentMessages = this.messagesByChannel.get(channelId) ?? []
      const lastMessageId = currentMessages.length > 0
        ? Math.max(...currentMessages.map(m => m.id))
        : 0

      realtimeClient.startPolling(channelId, (newMessages) => {
        const otherMessages = newMessages.filter(m => m.userId !== auth.currentUserId)

        if (otherMessages.length > 0) {
          const current = this.messagesByChannel.get(channelId) ?? []
          const existingIds = new Set(current.map(m => m.id))
          const uniqueNew = otherMessages.filter(m => !existingIds.has(m.id))

          if (uniqueNew.length > 0) {
            this.messagesByChannel.set(channelId, [...current, ...uniqueNew])
            uniqueNew.forEach(msg => this.notifyNewMessage(msg))
          }
        }
      }, lastMessageId)
    },

    notifyNewMessage(message: Message) {
      const auth = useAuthStore()
      const userStatus = useUserStatusStore()

      if (userStatus.isDnd || userStatus.isOffline) {
        return
      }

      if (auth.user?.notifyMentionsOnly) {
        const myNickName = auth.user.nickName
        if (!message.mentionedUsers.includes(myNickName)) {
          return
        }
      }

      if (document.visibilityState === 'visible') {
        return
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        const authorName = message.author?.nickName ?? 'Someone'
        const body = message.content.length > NOTIFICATION.MAX_LENGTH
          ? message.content.substring(0, NOTIFICATION.MAX_LENGTH) + '...'
          : message.content

        new Notification(`New message from ${authorName}`, {
          body,
          icon: '/favicon.ico',
          tag: String(message.id)
        })
      }
    },

    async requestNotificationPermission() {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission()
      }
    },

    cleanup() {
      realtimeClient.stopPolling()
      this.currentSubscriptionChannelId = null
      this.loading = false
    },

    reset() {
      this.cleanup()
      this.messagesByChannel.clear()
      this.hasMore.clear()
      this.loading = false
    }
  }
})
