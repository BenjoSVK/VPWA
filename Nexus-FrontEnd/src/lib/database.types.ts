export type {
  User as Profile,
  Channel,
  ChannelMember,
  Message
} from './api'
export interface ChannelWithMembership {
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

export interface ChannelMemberWithProfile {
  id: number
  userId: number
  isInvited: boolean
  joinedAt: string | null
  profile: {
    id: number
    first_name: string
    last_name: string
    nick_name: string
  } | null
}

export interface MessageWithAuthor {
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
    nick_name?: string
  } | null
}
