import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'labels'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.setNullable('slug')
    })
  }

  async down() {}
}
