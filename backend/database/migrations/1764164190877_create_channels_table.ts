import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 100).notNullable()
      table.boolean('is_private').defaultTo(false)
      table.integer('admin_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('last_activity_at').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Unique name for active channels
      table.unique(['name'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

