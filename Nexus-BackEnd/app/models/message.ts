import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeSave, afterFind, afterFetch } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Channel from './channel.js'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare channelId: number

  @column()
  declare userId: number

  @column()
  declare content: string

  @column({
    prepare: (value: string[]) => JSON.stringify(value ?? []),
    consume: (value: string) => {
      try {
        return JSON.parse(value ?? '[]')
      } catch {
        return []
      }
    }
  })
  declare mentionedUsers: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>

  @belongsTo(() => Channel)
  declare channel: BelongsTo<typeof Channel>
}
