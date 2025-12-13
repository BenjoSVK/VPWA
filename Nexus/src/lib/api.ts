const API_URL = 'http://localhost:3333'

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export function getAuthToken(): string | null {
  // Always read from localStorage to ensure we have the latest value
  return localStorage.getItem('auth_token')
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getAuthToken()
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Auth API
export const authApi = {
  register: (data: { firstName: string; lastName: string; nickName: string; email: string; password: string }) =>
    request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),

  me: () => request<User>('/auth/me'),

  updateProfile: (data: { firstName?: string; lastName?: string; notifyMentionsOnly?: boolean }) =>
    request<User>('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
}

// Channels API
export const channelsApi = {
  list: () => request<Channel[]>('/channels'),

  join: (name: string, isPrivate = false) =>
    request<Channel>('/channels/join', { method: 'POST', body: JSON.stringify({ name, isPrivate }) }),

  members: (channelId: number) => request<ChannelMember[]>(`/channels/${channelId}/members`),

  invite: (channelId: number, nickName: string) =>
    request<{ message: string }>(`/channels/${channelId}/invite`, { method: 'POST', body: JSON.stringify({ nickName }) }),

  revoke: (channelId: number, nickName: string) =>
    request<{ message: string }>(`/channels/${channelId}/revoke`, { method: 'POST', body: JSON.stringify({ nickName }) }),

  kick: (channelId: number, nickName: string) =>
    request<{ message: string }>(`/channels/${channelId}/kick`, { method: 'POST', body: JSON.stringify({ nickName }) }),

  leave: (channelId: number) =>
    request<{ message: string }>(`/channels/${channelId}/leave`, { method: 'POST' }),

  delete: (channelId: number) =>
    request<{ message: string }>(`/channels/${channelId}`, { method: 'DELETE' }),

  // Typing indicator
  setTyping: (channelId: number) =>
    request<{ success: boolean }>(`/channels/${channelId}/typing`, { method: 'POST' }),

  getTyping: (channelId: number) =>
    request<{ typing: string[] }>(`/channels/${channelId}/typing`),
}

// Messages API
export const messagesApi = {
  list: (channelId: number, page = 1, limit = 50) =>
    request<{ data: Message[]; meta: { total: number; perPage: number; currentPage: number; lastPage: number } }>(
      `/channels/${channelId}/messages?page=${page}&limit=${limit}`
    ),

  send: (channelId: number, content: string) =>
    request<Message>(`/channels/${channelId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
}

// Types
export interface User {
  id: number
  firstName: string
  lastName: string
  nickName: string
  email: string
  notifyMentionsOnly: boolean
}

export interface Channel {
  id: number
  name: string
  isPrivate: boolean
  adminId: number
  lastActivityAt: string
  isMember: boolean
  isAdmin: boolean
  isInvited: boolean
  isBanned: boolean
}

export interface ChannelMember {
  id: number
  userId: number
  isInvited: boolean
  joinedAt: string | null
  user: {
    id: number
    firstName: string
    lastName: string
    nickName: string
  }
}

export interface Message {
  id: number
  channelId: number
  userId: number
  content: string
  mentionedUsers: string[]
  createdAt: string
  author: {
    id: number
    firstName: string
    lastName: string
    nickName: string
  } | null
}

// Simple polling client for realtime (no Transmit needed)
export const realtimeClient = {
  pollingInterval: null as ReturnType<typeof setInterval> | null,
  
  startPolling(channelId: number, onNewMessages: (messages: Message[]) => void, lastMessageId: number = 0) {
    this.stopPolling()
    
    let lastId = lastMessageId
    
    this.pollingInterval = setInterval(() => {
      void (async () => {
        try {
          const response = await messagesApi.list(channelId, 1, 50)
          const newMessages = response.data.filter(m => m.id > lastId)
          
          if (newMessages.length > 0) {
            lastId = Math.max(...newMessages.map(m => m.id))
            onNewMessages(newMessages)
          }
        } catch (error) {
          console.error('Polling error:', error)
        }
      })()
    }, 3000) // Poll every 3 seconds
  },
  
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
  }
}
