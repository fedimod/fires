import User from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = User.table

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.jsonb('permissions').defaultTo('[]').notNullable()
      table.boolean('is_admin').defaultTo(false).notNullable()
    })

    // Make all existing users admins:
    this.defer(async (db) => {
      await db.from(this.tableName).update({ is_admin: true })
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('permissions', 'is_admin')
    })
  }
}
