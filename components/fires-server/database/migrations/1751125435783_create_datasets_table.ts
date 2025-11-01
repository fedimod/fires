import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'datasets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.text('slug').notNullable().unique()

      // Based on the maximum length of a BCP-47 language tag:
      // https://www.rfc-editor.org/rfc/rfc5646#section-4.4.1
      table.string('locale', 35).notNullable().comment('BCP-47 language tag')

      table.text('name').notNullable()
      table.text('summary')
      table.text('description')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
