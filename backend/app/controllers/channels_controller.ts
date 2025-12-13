import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import ChannelMember from '#models/channel_member'
import Kick from '#models/kick'
import User from '#models/user'
import { DateTime } from 'luxon'
import transmit from '@adonisjs/transmit/services/main'

// In-memory typing status store
// Key: channelId, Value: Map of userId -> { nickName, expiresAt }
const typingUsers: Map<number, Map<number, { nickName: string; expiresAt: Date }>> = new Map()

export default class ChannelsController {
  // Get all channels user is member of or can join (public)
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    // Calculate 30 days ago for expiry filter
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 })

    // Get user's memberships (only active channels - not expired)
    const memberships = await ChannelMember.query()
      .where('userId', user.id)
      .preload('channel', (query) => {
        query.where('lastActivityAt', '>', thirtyDaysAgo.toSQL()!).preload('admin')
      })
      .whereHas('channel', (query) => {
        query.where('lastActivityAt', '>', thirtyDaysAgo.toSQL()!)
      })

    // Get public channels (only active - not expired)
    const publicChannels = await Channel.query()
      .where('isPrivate', false)
      .where('lastActivityAt', '>', thirtyDaysAgo.toSQL()!)
      .preload('admin')

    // Combine and format
    const membershipMap = new Map(memberships.map((m) => [m.channelId, m]))
    const channelsMap = new Map<number, object>()

    // Add public channels
    for (const channel of publicChannels) {
      const membership = membershipMap.get(channel.id)
      channelsMap.set(channel.id, {
        id: channel.id,
        name: channel.name,
        isPrivate: channel.isPrivate,
        adminId: channel.adminId,
        lastActivityAt: channel.lastActivityAt,
        isMember: membership ? !membership.isInvited && !membership.isBanned : false,
        isAdmin: channel.adminId === user.id,
        isInvited: membership?.isInvited ?? false,
        isBanned: membership?.isBanned ?? false,
      })
    }

    // Add private channels from memberships
    for (const membership of memberships) {
      if (!channelsMap.has(membership.channelId)) {
        const channel = membership.channel
        channelsMap.set(channel.id, {
          id: channel.id,
          name: channel.name,
          isPrivate: channel.isPrivate,
          adminId: channel.adminId,
          lastActivityAt: channel.lastActivityAt,
          isMember: !membership.isInvited && !membership.isBanned,
          isAdmin: channel.adminId === user.id,
          isInvited: membership.isInvited,
          isBanned: membership.isBanned,
        })
      }
    }

    return response.ok(Array.from(channelsMap.values()))
  }

  // Join or create a channel
  async join({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { name, isPrivate = false } = request.only(['name', 'isPrivate'])

    if (!name || name.length < 3) {
      return response.badRequest({ message: 'Channel name must be at least 3 characters' })
    }

    // Calculate 30 days ago for expiry check
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 })

    // Check if active channel exists (not expired)
    let channel = await Channel.query()
      .where('name', name)
      .where('lastActivityAt', '>', thirtyDaysAgo.toSQL()!)
      .first()

    if (channel) {
      // Channel exists - try to join
      if (channel.isPrivate) {
        // Check if user is invited
        const membership = await ChannelMember.query()
          .where('channelId', channel.id)
          .where('userId', user.id)
          .first()

        if (!membership || !membership.isInvited) {
          return response.forbidden({ message: 'Cannot join private channel without invitation' })
        }

        if (membership.isBanned) {
          return response.forbidden({ message: 'You are banned from this channel' })
        }

        // Accept invitation
        membership.isInvited = false
        membership.joinedAt = DateTime.now()
        await membership.save()
      } else {
        // Public channel - join or check existing membership
        const existingMembership = await ChannelMember.query()
          .where('channelId', channel.id)
          .where('userId', user.id)
          .first()

        if (existingMembership) {
          if (existingMembership.isBanned) {
            return response.forbidden({ message: 'You are banned from this channel' })
          }
          if (existingMembership.isInvited) {
            existingMembership.isInvited = false
            existingMembership.joinedAt = DateTime.now()
            await existingMembership.save()
          }
          // Already a member
        } else {
          // Join public channel
          await ChannelMember.create({
            channelId: channel.id,
            userId: user.id,
            isInvited: false,
            isBanned: false,
            joinedAt: DateTime.now(),
          })
        }
      }
    } else {
      // Create new channel
      channel = await Channel.create({
        name,
        isPrivate,
        adminId: user.id,
        lastActivityAt: DateTime.now(),
      })

      // Add creator as member
      await ChannelMember.create({
        channelId: channel.id,
        userId: user.id,
        isInvited: false,
        isBanned: false,
        joinedAt: DateTime.now(),
      })
    }

    await channel.load('admin')

    return response.ok({
      id: channel.id,
      name: channel.name,
      isPrivate: channel.isPrivate,
      adminId: channel.adminId,
      lastActivityAt: channel.lastActivityAt,
      isMember: true,
      isAdmin: channel.adminId === user.id,
      isInvited: false,
      isBanned: false,
    })
  }

  // Get channel members
  async members({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.id

    // Check if user is member
    const membership = await ChannelMember.query()
      .where('channelId', channelId)
      .where('userId', user.id)
      .where('isBanned', false)
      .first()

    if (!membership) {
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    const members = await ChannelMember.query()
      .where('channelId', channelId)
      .where('isBanned', false)
      .preload('user')

    return response.ok(
      members.map((m) => ({
        id: m.id,
        userId: m.userId,
        isInvited: m.isInvited,
        joinedAt: m.joinedAt,
        user: {
          id: m.user.id,
          firstName: m.user.firstName,
          lastName: m.user.lastName,
          nickName: m.user.nickName,
        },
      }))
    )
  }

  // Invite user to channel
  async invite({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.id
    const { nickName } = request.only(['nickName'])

    const channel = await Channel.find(channelId)
    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    // For private channels, only admin can invite
    if (channel.isPrivate && channel.adminId !== user.id) {
      return response.forbidden({ message: 'Only admin can invite to private channels' })
    }

    // Check if inviter is a member
    const inviterMembership = await ChannelMember.query()
      .where('channelId', channelId)
      .where('userId', user.id)
      .where('isBanned', false)
      .first()

    if (!inviterMembership) {
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    // Find target user
    const targetUser = await User.findBy('nickName', nickName)
    if (!targetUser) {
      return response.notFound({ message: `User "${nickName}" not found` })
    }

    // Check existing membership
    const existingMembership = await ChannelMember.query()
      .where('channelId', channelId)
      .where('userId', targetUser.id)
      .first()

    if (existingMembership) {
      if (existingMembership.isBanned) {
        // Admin can unban
        if (channel.adminId === user.id) {
          existingMembership.isBanned = false
          existingMembership.isInvited = false
          await existingMembership.save()

          // Clear kicks
          await Kick.query()
            .where('channelId', channelId)
            .where('targetUserId', targetUser.id)
            .delete()

          // Notify via transmit
          transmit.broadcast(`channel/${channelId}`, { type: 'member_unbanned', userId: targetUser.id })

          return response.ok({ message: 'User unbanned successfully' })
        }
        return response.forbidden({ message: 'User is banned from this channel' })
      }
      if (!existingMembership.isInvited) {
        return response.conflict({ message: 'User is already a member' })
      }
      return response.conflict({ message: 'User is already invited' })
    }

    // Create invitation
    await ChannelMember.create({
      channelId,
      userId: targetUser.id,
      isInvited: true,
      isBanned: false,
      invitedAt: DateTime.now(),
    })

    // Notify target user
    transmit.broadcast(`user/${targetUser.id}`, { type: 'channel_invite', channelId, channelName: channel.name })

    return response.ok({ message: 'User invited successfully' })
  }

  // Revoke user from private channel
  async revoke({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.id
    const { nickName } = request.only(['nickName'])

    const channel = await Channel.find(channelId)
    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    if (channel.adminId !== user.id) {
      return response.forbidden({ message: 'Only admin can revoke users' })
    }

    if (!channel.isPrivate) {
      return response.badRequest({ message: 'Revoke is only for private channels. Use kick for public channels.' })
    }

    const targetUser = await User.findBy('nickName', nickName)
    if (!targetUser) {
      return response.notFound({ message: `User "${nickName}" not found` })
    }

    await ChannelMember.query()
      .where('channelId', channelId)
      .where('userId', targetUser.id)
      .delete()

    transmit.broadcast(`channel/${channelId}`, { type: 'member_removed', userId: targetUser.id })
    transmit.broadcast(`user/${targetUser.id}`, { type: 'removed_from_channel', channelId })

    return response.ok({ message: 'User removed successfully' })
  }

  // Kick user from public channel
  async kick({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.id
    const { nickName } = request.only(['nickName'])

    const channel = await Channel.find(channelId)
    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    if (channel.isPrivate) {
      return response.badRequest({ message: 'Use revoke for private channels' })
    }

    const targetUser = await User.findBy('nickName', nickName)
    if (!targetUser) {
      return response.notFound({ message: `User "${nickName}" not found` })
    }

    if (targetUser.id === user.id) {
      return response.badRequest({ message: 'You cannot kick yourself' })
    }

    // Admin can kick permanently
    if (channel.adminId === user.id) {
      await ChannelMember.query()
        .where('channelId', channelId)
        .where('userId', targetUser.id)
        .update({ isBanned: true })

      transmit.broadcast(`channel/${channelId}`, { type: 'member_banned', userId: targetUser.id })
      transmit.broadcast(`user/${targetUser.id}`, { type: 'banned_from_channel', channelId })

      return response.ok({ message: 'User banned successfully' })
    }

    // Check if already kicked by this user
    const existingKick = await Kick.query()
      .where('channelId', channelId)
      .where('targetUserId', targetUser.id)
      .where('kickedByUserId', user.id)
      .first()

    if (existingKick) {
      return response.conflict({ message: 'You already voted to kick this user' })
    }

    // Add kick vote
    await Kick.create({
      channelId,
      targetUserId: targetUser.id,
      kickedByUserId: user.id,
    })

    // Count kicks
    const kickCount = await Kick.query()
      .where('channelId', channelId)
      .where('targetUserId', targetUser.id)
      .count('* as total')

    const total = Number(kickCount[0].$extras.total)

    if (total >= 3) {
      // Ban the user
      await ChannelMember.query()
        .where('channelId', channelId)
        .where('userId', targetUser.id)
        .update({ isBanned: true })

      transmit.broadcast(`channel/${channelId}`, { type: 'member_banned', userId: targetUser.id })
      transmit.broadcast(`user/${targetUser.id}`, { type: 'banned_from_channel', channelId })

      return response.ok({ message: 'User banned (3+ kicks)' })
    }

    return response.ok({ message: `Kick vote added (${total}/3)` })
  }

  // Leave channel
  async leave({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.id

    const channel = await Channel.find(channelId)
    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    if (channel.adminId === user.id) {
      // Admin leaving = delete channel
      await channel.delete()
      transmit.broadcast(`channel/${channelId}`, { type: 'channel_deleted' })
      return response.ok({ message: 'Channel deleted' })
    }

    await ChannelMember.query()
      .where('channelId', channelId)
      .where('userId', user.id)
      .delete()

    transmit.broadcast(`channel/${channelId}`, { type: 'member_left', userId: user.id })

    return response.ok({ message: 'Left channel successfully' })
  }

  // Delete channel (admin only)
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.id

    const channel = await Channel.find(channelId)
    if (!channel) {
      return response.notFound({ message: 'Channel not found' })
    }

    if (channel.adminId !== user.id) {
      return response.forbidden({ message: 'Only admin can delete the channel' })
    }

    await channel.delete()
    transmit.broadcast(`channel/${channelId}`, { type: 'channel_deleted' })

    return response.ok({ message: 'Channel deleted' })
  }

  // Set typing status
  async setTyping({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channelId = Number(params.channelId)

    // Initialize channel typing map if not exists
    if (!typingUsers.has(channelId)) {
      typingUsers.set(channelId, new Map())
    }

    const channelTyping = typingUsers.get(channelId)!
    
    // Set typing status with 5 second expiry
    channelTyping.set(user.id, {
      nickName: user.nickName,
      expiresAt: new Date(Date.now() + 5000)
    })

    return response.ok({ success: true })
  }

  // Get typing users for a channel
  async getTyping({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channelId = Number(params.channelId)

    const channelTyping = typingUsers.get(channelId)
    if (!channelTyping) {
      return response.ok({ typing: [] })
    }

    const now = new Date()
    const activeTypers: string[] = []

    // Clean up expired entries and collect active typers
    for (const [userId, data] of channelTyping.entries()) {
      if (data.expiresAt < now) {
        channelTyping.delete(userId)
      } else if (userId !== user.id) {
        // Don't include current user
        activeTypers.push(data.nickName)
      }
    }

    return response.ok({ typing: activeTypers })
  }
}

