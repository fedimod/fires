import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dataset_changes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('dataset_id').references('id').inTable('datasets').onDelete('CASCADE')

      table.text('entity_kind').notNullable()
      table.text('entity_key').notNullable()

      table.enum('type', ['advisory', 'recommendation', 'retraction', 'tombstone']).notNullable()

      table.jsonb('labels').defaultTo('[]').notNullable()

      table.enum('recommended_policy', ['accept', 'filter', 'reject', 'drop']).nullable()
      table.jsonb('recommended_filter').defaultTo('[]').notNullable()

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
