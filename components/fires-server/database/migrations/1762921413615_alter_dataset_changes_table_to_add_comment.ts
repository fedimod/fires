import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dataset_changes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('comment').defaultTo('')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('comment')
    })
  }
}
