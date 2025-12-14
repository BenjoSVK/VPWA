import { useChannelsStore } from 'src/stores/channels/channels'

export interface CommandResult {
  success: boolean
  message: string
  type: 'success' | 'error' | 'info'
}

interface ParsedCommand {
  command: string
  args: string[]
}

function parseCommand(input: string): ParsedCommand | null {
  const trimmed = input.trim()
  if (!trimmed.startsWith('/')) return null

  const parts = trimmed.slice(1).split(/\s+/)
  const command = parts[0]
  if (!command) return null
  
  const args = parts.slice(1)

  return { command: command.toLowerCase(), args }
}

export async function executeCommand(input: string): Promise<CommandResult | null> {
  const parsed = parseCommand(input)
  if (!parsed) return null

  const channels = useChannelsStore()

  const { command, args } = parsed

  switch (command) {
    case 'join': {
      const channelName = args[0]
      if (!channelName) {
        return {
          success: false,
          message: 'Usage: /join channelName [private]',
          type: 'error'
        }
      }

      const isPrivate = args[1]?.toLowerCase() === 'private'

      const result = await channels.joinChannel(channelName, isPrivate)
      
      if (result.success) {
        return {
          success: true,
          message: `Joined channel "${channelName}"`,
          type: 'success'
        }
      } else {
        return {
          success: false,
          message: result.error ?? 'Failed to join channel',
          type: 'error'
        }
      }
    }

    case 'invite': {
      const nickName = args[0]
      if (!nickName) {
        return {
          success: false,
          message: 'Usage: /invite nickName',
          type: 'error'
        }
      }

      const result = await channels.inviteUser(nickName)

      if (result.success) {
        return {
          success: true,
          message: `Invited "${nickName}" to the channel`,
          type: 'success'
        }
      } else {
        return {
          success: false,
          message: result.error ?? 'Failed to invite user',
          type: 'error'
        }
      }
    }

    case 'revoke': {
      const nickName = args[0]
      if (!nickName) {
        return {
          success: false,
          message: 'Usage: /revoke nickName',
          type: 'error'
        }
      }

      const result = await channels.revokeUser(nickName)

      if (result.success) {
        return {
          success: true,
          message: `Revoked "${nickName}" from the channel`,
          type: 'success'
        }
      } else {
        return {
          success: false,
          message: result.error ?? 'Failed to revoke user',
          type: 'error'
        }
      }
    }

    case 'kick': {
      const nickName = args[0]
      if (!nickName) {
        return {
          success: false,
          message: 'Usage: /kick nickName',
          type: 'error'
        }
      }

      const result = await channels.kickUser(nickName)

      if (result.success) {
        const channel = channels.selected
        if (channel?.isAdmin) {
          return {
            success: true,
            message: `Kicked "${nickName}" from the channel`,
            type: 'success'
          }
        } else {
          return {
            success: true,
            message: `Voted to kick "${nickName}". 3 votes needed for ban.`,
            type: 'info'
          }
        }
      } else {
        return {
          success: false,
          message: result.error ?? 'Failed to kick user',
          type: 'error'
        }
      }
    }

    case 'quit': {
      const channel = channels.selected
      if (!channel) {
        return {
          success: false,
          message: 'No channel selected',
          type: 'error'
        }
      }

      const result = await channels.deleteChannel()

      if (result.success) {
        return {
          success: true,
          message: `Channel "${channel.name}" has been deleted`,
          type: 'success'
        }
      } else {
        return {
          success: false,
          message: result.error ?? 'Failed to delete channel',
          type: 'error'
        }
      }
    }

    case 'cancel': {
      const channel = channels.selected
      if (!channel) {
        return {
          success: false,
          message: 'No channel selected',
          type: 'error'
        }
      }

      const result = await channels.leaveChannel()

      if (result.success) {
        return {
          success: true,
          message: `Left channel "${channel.name}"`,
          type: 'success'
        }
      } else {
        return {
          success: false,
          message: result.error ?? 'Failed to leave channel',
          type: 'error'
        }
      }
    }

    case 'list': {
      // Show the users panel temporarily (no popup needed)
      void channels.showUsersListTemporarily()
      return null // Don't show any banner
    }

    case 'help': {
      return {
        success: true,
        message: `Available commands:
/join channelName [private] - Join or create a channel
/invite nickName - Invite user to channel
/revoke nickName - Remove user from private channel (admin only)
/kick nickName - Kick user from public channel
/quit - Delete channel (admin only)
/cancel - Leave channel
/list - Show channel members
@nickName - Mention user in message`,
        type: 'info'
      }
    }

    default: {
      return {
        success: false,
        message: `Unknown command: /${command}. Type /help for available commands.`,
        type: 'error'
      }
    }
  }
}

export function isCommand(input: string): boolean {
  return input.trim().startsWith('/')
}
