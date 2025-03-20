import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'labels'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('deprecated_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('deprecated_at')
    })
  }
}
