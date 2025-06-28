import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dataset_changes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['dataset_id', 'entity_kind', 'entity_key', 'id'], 'snapshot_idx')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['dataset_id', 'entity_kind', 'entity_key', 'id'], 'snapshot_idx')
    })
  }
}
