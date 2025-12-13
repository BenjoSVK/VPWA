import { defineStore } from 'pinia'
import { messagesApi, realtimeClient, type Message } from 'src/lib/api'
import { useAuthStore } from '../auth/auth'
import { useChannelsStore } from '../channels/channels'

interface MessagesState {
  messagesByChannel: Map<number, Message[]>
  loading: boolean
  hasMore: Map<number, boolean>
  currentSubscriptionChannelId: number | null
}

const PAGE_SIZE = 50

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
        const page = loadMore ? Math.ceil(currentMessages.length / PAGE_SIZE) + 1 : 1

        const response = await messagesApi.list(channelId, page, PAGE_SIZE)

        if (loadMore) {
          this.messagesByChannel.set(channelId, [...response.data, ...currentMessages])
        } else {
          this.messagesByChannel.set(channelId, response.data)
        }

        this.hasMore.set(channelId, response.meta.currentPage < response.meta.lastPage)

        return response.data
      } catch (error) {
        console.error('Error fetching messages:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async sendMessage(content: string): Promise<{ success: boolean; error?: string; message?: Message }> {
      const auth = useAuthStore()
      const channels = useChannelsStore()

      if (!auth.currentUserId || !channels.selectedId) {
        return { success: false, error: 'Not authenticated or no channel selected' }
      }

      try {
        const message = await messagesApi.send(channels.selectedId, content)

        // Add to local state immediately
        const currentMessages = this.messagesByChannel.get(channels.selectedId) ?? []
        this.messagesByChannel.set(channels.selectedId, [...currentMessages, message])

        return { success: true, message }
      } catch (error) {
        console.error('Error sending message:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to send message' }
      }
    },

    setupRealtimeSubscription(channelId: number) {
      const auth = useAuthStore()
      
      // Stop previous polling
      if (this.currentSubscriptionChannelId && this.currentSubscriptionChannelId !== channelId) {
        realtimeClient.stopPolling()
      }

      if (this.currentSubscriptionChannelId === channelId) {
        return
      }

      this.currentSubscriptionChannelId = channelId

      // Get last message ID for polling
      const currentMessages = this.messagesByChannel.get(channelId) ?? []
      const lastMessageId = currentMessages.length > 0 
        ? Math.max(...currentMessages.map(m => m.id)) 
        : 0

      // Start polling for new messages
      realtimeClient.startPolling(channelId, (newMessages) => {
        // Filter out own messages (already added optimistically)
        const otherMessages = newMessages.filter(m => m.userId !== auth.currentUserId)
        
        if (otherMessages.length > 0) {
          const current = this.messagesByChannel.get(channelId) ?? []
          const existingIds = new Set(current.map(m => m.id))
          const uniqueNew = otherMessages.filter(m => !existingIds.has(m.id))
          
          if (uniqueNew.length > 0) {
            this.messagesByChannel.set(channelId, [...current, ...uniqueNew])
            
            // Notify for new messages
            uniqueNew.forEach(msg => this.notifyNewMessage(msg))
          }
        }
      }, lastMessageId)
    },

    notifyNewMessage(message: Message) {
      const auth = useAuthStore()
      
      // Check if user wants mentions only
      if (auth.user?.notifyMentionsOnly) {
        const myNickName = auth.user.nickName
        if (!message.mentionedUsers.includes(myNickName)) {
          return
        }
      }

      // Check if app is visible
      if (document.visibilityState === 'visible') {
        return
      }

      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const authorName = message.author?.nickName ?? 'Someone'
        const body = message.content.length > 100 
          ? message.content.substring(0, 100) + '...' 
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
