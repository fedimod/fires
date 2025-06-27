import { DateTime } from 'luxon'
import { BaseModel, beforeSave, beforeCreate, column } from '@adonisjs/lucid/orm'
import { UuidBaseModel } from '#utils/lucid_extensions'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class Label extends BaseModel {
  @column()
  declare language: string

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

  static assignId() {
    //
  }

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
