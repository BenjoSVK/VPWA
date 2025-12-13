import { defineStore } from 'pinia'
import { authApi, setAuthToken, getAuthToken, type User } from 'src/lib/api'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUserId: (state) => state.user?.id ?? null,
    currentNickName: (state) => state.user?.nickName ?? null,
    fullName: (state) => {
      if (!state.user) return null
      return `${state.user.firstName} ${state.user.lastName}`.trim()
    },
    profile: (state) => state.user ? {
      id: state.user.id,
      first_name: state.user.firstName,
      last_name: state.user.lastName,
      nick_name: state.user.nickName,
      email: state.user.email,
      notify_mentions_only: state.user.notifyMentionsOnly
    } : null
  },

  actions: {
    async initialize() {
      if (this.initialized) return

      try {
        this.loading = true
        
        // Check if we have a stored token
        const token = getAuthToken()
        if (token) {
          try {
            this.user = await authApi.me()
          } catch {
            // Token is invalid
            setAuthToken(null)
          }
        }

        this.initialized = true
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        this.loading = false
      }
    },

    async register(email: string, password: string, firstName: string, lastName: string, nickName: string) {
      this.loading = true
      
      try {
        const { user, token } = await authApi.register({
          email,
          password,
          firstName,
          lastName,
          nickName
        })

        setAuthToken(token)
        this.user = user

        return { success: true }
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(email: string, password: string) {
      this.loading = true
      
      try {
        const { user, token } = await authApi.login({ email, password })

        setAuthToken(token)
        this.user = user

        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      
      try {
        await authApi.logout()
      } catch (error) {
        console.error('Logout error:', error)
      }

      // Clear state regardless
      setAuthToken(null)
      this.user = null
      this.initialized = false
      this.loading = false

      // Clear storage
      localStorage.clear()
      sessionStorage.clear()

      return { success: true }
    },

    async updateProfile(updates: { firstName?: string; lastName?: string }) {
      if (!this.user) throw new Error('Not authenticated')

      const updatedUser = await authApi.updateProfile(updates)
      this.user = updatedUser
      return updatedUser
    },

    async updateNotificationSettings(mentionsOnly: boolean) {
      if (!this.user) throw new Error('Not authenticated')

      const updatedUser = await authApi.updateProfile({ notifyMentionsOnly: mentionsOnly })
      this.user = updatedUser
      return updatedUser
    }
  }
})
