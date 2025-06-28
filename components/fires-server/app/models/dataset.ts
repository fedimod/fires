import { DateTime } from 'luxon'
import { beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { UuidBaseModel } from '#utils/lucid_extensions'
import stringHelpers from '@adonisjs/core/helpers/string'
import DatasetChange from '#models/dataset_change'
import db from '@adonisjs/lucid/services/db'

export default class Dataset extends UuidBaseModel {
  @column()
  declare slug: string

  @column()
  declare locale: string

  @column()
  declare name: string

  @column()
  declare summary: string

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setSlug(dataset: Dataset) {
    if (dataset.$dirty.name) {
      dataset.slug = stringHelpers.slug(dataset.name, {
        lower: true,
        trim: true,
        strict: true,
      })
    }
  }

  @hasMany(() => DatasetChange)
  declare changes: HasMany<typeof DatasetChange>

  static async countChanges(dataset_id: string): Promise<number> {
    const { count } = await db
      .from(DatasetChange.table)
      .where('dataset_id', dataset_id)
      .count('id', 'count')
      .first()

    return Number.parseInt(count, 10)
  }
}
