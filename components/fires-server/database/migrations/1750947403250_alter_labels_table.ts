import stringHelpers from '@adonisjs/core/helpers/string'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'labels'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('slug').nullable().unique()
    })

    this.defer(async (db) => {
      const labelsWithoutSlugs = await db
        .from(this.tableName)
        .select(['name', 'id'])
        .whereNull('slug')

      await Promise.all(
        labelsWithoutSlugs.map((label) => {
          return db
            .from(this.tableName)
            .where('id', label.id)
            .update({
              slug: stringHelpers.slug(label.name, {
                lower: true,
                trim: true,
                strict: true,
              }),
            })
        })
      )
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('slug')
    })
  }
}
