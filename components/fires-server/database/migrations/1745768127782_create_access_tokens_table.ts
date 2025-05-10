import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'access_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.text('token').notNullable().unique()
      table.text('description')

      table.jsonb('abilities').defaultTo('[]').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.timestamp('last_used_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
