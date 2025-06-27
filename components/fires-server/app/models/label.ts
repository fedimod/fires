import { DateTime } from 'luxon'
import { beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import { UuidBaseModel } from '#utils/lucid_extensions'
import stringHelpers from '@adonisjs/core/helpers/string'
import LabelTranslation from '#models/label_translation'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Label extends UuidBaseModel {
  @column()
  declare locale: string

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare summary: string

  @column()
  declare description: string

  @column.dateTime()
  declare deprecatedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => LabelTranslation)
  declare translations: HasMany<typeof LabelTranslation>

  @beforeSave()
  static async setSlug(label: Label) {
    if (label.$dirty.name) {
      label.slug = stringHelpers.slug(label.name, {
        lower: true,
        trim: true,
        strict: true,
      })
    }
  }
}
