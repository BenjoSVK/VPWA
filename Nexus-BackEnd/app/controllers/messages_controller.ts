import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import Channel from '#models/channel'
import ChannelMember from '#models/channel_member'
import { DateTime } from 'luxon'
import transmit from '@adonisjs/transmit/services/main'

export default class MessagesController {
  // Get messages for a channel
  async index({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.channelId
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    // Check if user is member
    const membership = await ChannelMember.query()
      .where('channelId', channelId)
      .where('userId', user.id)
      .where('isBanned', false)
      .where('isInvited', false)
      .first()

    if (!membership) {
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    const messages = await Message.query()
      .where('channelId', channelId)
      .preload('author')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return response.ok({
      data: messages.all().reverse().map((m) => ({
        id: m.id,
        channelId: m.channelId,
        userId: m.userId,
        content: m.content,
        mentionedUsers: m.mentionedUsers,
        createdAt: m.createdAt.toISO(),
        author: m.author ? {
          id: m.author.id,
          firstName: m.author.firstName,
          lastName: m.author.lastName,
          nickName: m.author.nickName,
        } : null,
      })),
      meta: messages.getMeta(),
    })
  }

  // Send a message
  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.channelId
    const { content } = request.only(['content'])

    if (!content || content.trim().length === 0) {
      return response.badRequest({ message: 'Message content is required' })
    }

    // Check if user is member
    const membership = await ChannelMember.query()
      .where('channelId', channelId)
      .where('userId', user.id)
      .where('isBanned', false)
      .where('isInvited', false)
      .first()

    if (!membership) {
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    // Extract mentions
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match
    while ((match = mentionRegex.exec(content)) !== null) {
      if (match[1]) {
        mentions.push(match[1])
      }
    }

    const message = await Message.create({
      channelId: Number(channelId),
      userId: user.id,
      content: content.trim(),
      mentionedUsers: mentions,
    })

    // Update channel activity
    await Channel.query()
      .where('id', channelId)
      .update({ lastActivityAt: DateTime.now().toSQL() })

    await message.load('author')

    const messageData = {
      id: message.id,
      channelId: message.channelId,
      userId: message.userId,
      content: message.content,
      mentionedUsers: message.mentionedUsers,
      createdAt: message.createdAt.toISO(),
      author: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName,
      },
    }

    // Broadcast to channel
    transmit.broadcast(`channel/${channelId}/messages`, {
      type: 'new_message',
      message: messageData,
    })

    return response.created(messageData)
  }
}

