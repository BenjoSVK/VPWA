import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kicks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('channel_id').unsigned().references('id').inTable('channels').onDelete('CASCADE')
      table.integer('target_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('kicked_by_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Each user can only kick another user once per channel
      table.unique(['channel_id', 'target_user_id', 'kicked_by_user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

