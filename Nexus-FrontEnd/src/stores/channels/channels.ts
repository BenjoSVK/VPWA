import { defineStore } from 'pinia'
import { channelsApi, type Channel, type ChannelMember } from 'src/lib/api'
import { useAuthStore } from '../auth/auth'
import { POLLING_INTERVALS, TIMEOUTS } from 'src/lib/constants'
import { getErrorMessage } from 'src/lib/errorHandler'

interface ChannelsState {
  channels: Channel[]
  selectedId: number | null
  loading: boolean
  members: Map<number, ChannelMember[]>
  pollingInterval: ReturnType<typeof setInterval> | null
  showUsersList: boolean
  usersListTimeout: ReturnType<typeof setTimeout> | null
  typingUsers: string[]
  typingInterval: ReturnType<typeof setInterval> | null
}

export const useChannelsStore = defineStore('channels', {
  state: (): ChannelsState => ({
    channels: [],
    selectedId: null,
    loading: false,
    members: new Map(),
    pollingInterval: null,
    showUsersList: false,
    usersListTimeout: null,
    typingUsers: [],
    typingInterval: null
  }),

  getters: {
    selected: (state) => state.channels.find(c => c.id === state.selectedId) ?? null,
    
    myChannels: (state) => state.channels.filter(c => c.isMember && !c.isBanned),
    
    invitedChannels: (state) => state.channels.filter(c => c.isInvited && !c.isMember),
    
    sortedChannels: (state) => {
      const invited = state.channels.filter(c => c.isInvited && !c.isMember)
      const member = state.channels.filter(c => c.isMember && !c.isBanned)
      return [...invited, ...member]
    },

    selectedMembers: (state) => {
      if (!state.selectedId) return []
      return state.members.get(state.selectedId) ?? []
    },

    isAdmin: (state) => {
      const auth = useAuthStore()
      const selected = state.channels.find(c => c.id === state.selectedId)
      return selected?.adminId === auth.currentUserId
    }
  },

  actions: {
    async fetchChannels() {
      const auth = useAuthStore()
      if (!auth.currentUserId) return

      this.loading = true

      try {
        this.channels = await channelsApi.list()
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching channels:', error)
        }
      } finally {
        this.loading = false
      }
    },

    async fetchMembers(channelId: number) {
      try {
        const members = await channelsApi.members(channelId)
        if (process.env.NODE_ENV === 'development') {
          console.log('Fetched members:', members.map(m => ({ nickName: m.user?.nickName, status: m.user?.status })))
        }
        this.members.set(channelId, members)
        return members
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching members:', error)
        }
        return []
      }
    },

    setSelected(id: number | null) {
      this.selectedId = id
      if (id) {
        void this.fetchMembers(id)
      }
    },

    async joinChannel(channelName: string, isPrivate = false): Promise<{ success: boolean; error?: string }> {
      const auth = useAuthStore()
      if (!auth.currentUserId) {
        return { success: false, error: 'Not authenticated' }
      }

      try {
        const channel = await channelsApi.join(channelName, isPrivate)
        await this.fetchChannels()
        this.setSelected(channel.id)
        return { success: true }
      } catch (error) {
        return { success: false, error: getErrorMessage(error) || 'Failed to join channel' }
      }
    },

    async createChannel(name: string, isPrivate: boolean): Promise<{ success: boolean; error?: string }> {
      return this.joinChannel(name, isPrivate)
    },

    async inviteUser(nickName: string): Promise<{ success: boolean; error?: string }> {
      if (!this.selectedId) {
        return { success: false, error: 'No channel selected' }
      }

      try {
        await channelsApi.invite(this.selectedId, nickName)
        await this.fetchMembers(this.selectedId)
        return { success: true }
      } catch (error) {
        return { success: false, error: getErrorMessage(error) || 'Failed to invite user' }
      }
    },

    async revokeUser(nickName: string): Promise<{ success: boolean; error?: string }> {
      if (!this.selectedId) {
        return { success: false, error: 'No channel selected' }
      }

      try {
        await channelsApi.revoke(this.selectedId, nickName)
        await this.fetchMembers(this.selectedId)
        return { success: true }
      } catch (error) {
        return { success: false, error: getErrorMessage(error) || 'Failed to revoke user' }
      }
    },

    async kickUser(nickName: string): Promise<{ success: boolean; error?: string }> {
      if (!this.selectedId) {
        return { success: false, error: 'No channel selected' }
      }

      try {
        await channelsApi.kick(this.selectedId, nickName)
        await this.fetchMembers(this.selectedId)
        return { success: true }
      } catch (error) {
        return { success: false, error: getErrorMessage(error) || 'Failed to kick user' }
      }
    },

    async leaveChannel(): Promise<{ success: boolean; error?: string }> {
      if (!this.selectedId) {
        return { success: false, error: 'No channel selected' }
      }

      try {
        await channelsApi.leave(this.selectedId)
        this.selectedId = null
        await this.fetchChannels()
        return { success: true }
      } catch (error) {
        return { success: false, error: getErrorMessage(error) || 'Failed to leave channel' }
      }
    },

    async deleteChannel(): Promise<{ success: boolean; error?: string }> {
      if (!this.selectedId) {
        return { success: false, error: 'No channel selected' }
      }

      try {
        await channelsApi.delete(this.selectedId)
        this.selectedId = null
        await this.fetchChannels()
        return { success: true }
      } catch (error) {
        return { success: false, error: getErrorMessage(error) || 'Failed to delete channel' }
      }
    },

    setupRealtimeSubscription() {
      this.stopPolling()

      void this.fetchChannels()

      this.pollingInterval = setInterval(() => {
        void this.fetchChannels()
      }, POLLING_INTERVALS.CHANNELS)
    },

    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    },

    reset() {
      this.stopPolling()
      this.stopTypingPolling()
      this.hideUsersList()
      this.channels = []
      this.selectedId = null
      this.loading = false
      this.members = new Map()
      this.typingUsers = []
    },

    async showUsersListTemporarily() {
      if (this.usersListTimeout) {
        clearTimeout(this.usersListTimeout)
      }
      
      this.showUsersList = true
      
      if (this.selectedId) {
        await this.fetchMembers(this.selectedId)
      }
      
      this.usersListTimeout = setTimeout(() => {
        this.showUsersList = false
        this.usersListTimeout = null
      }, TIMEOUTS.USERS_LIST_HIDE)
    },

    hideUsersList() {
      if (this.usersListTimeout) {
        clearTimeout(this.usersListTimeout)
        this.usersListTimeout = null
      }
      this.showUsersList = false
    },

    async sendTyping() {
      if (!this.selectedId) return
      try {
        await channelsApi.setTyping(this.selectedId)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Typing indicator error:', error)
        }
      }
    },

    async fetchTypingUsers() {
      if (!this.selectedId) return
      try {
        const response = await channelsApi.getTyping(this.selectedId)
        this.typingUsers = response.typing
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Typing fetch error:', error)
        }
      }
    },

    startTypingPolling() {
      this.stopTypingPolling()

      this.typingInterval = setInterval(() => {
        void this.fetchTypingUsers()
      }, POLLING_INTERVALS.TYPING)
    },

    stopTypingPolling() {
      if (this.typingInterval) {
        clearInterval(this.typingInterval)
        this.typingInterval = null
      }
      this.typingUsers = []
    }
  }
})
