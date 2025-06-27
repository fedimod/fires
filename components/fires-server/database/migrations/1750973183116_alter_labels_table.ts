import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'labels'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('language', 'locale')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('locale', 'language')
    })
  }
}
