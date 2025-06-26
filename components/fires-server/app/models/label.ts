import { DateTime } from 'luxon'
import { v7 as uuidv7 } from 'uuid'
import { BaseModel, beforeSave, beforeCreate, column } from '@adonisjs/lucid/orm'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class Label extends BaseModel {
  selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

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

  @beforeCreate()
  static assignId(label: Label) {
    label.id = uuidv7()
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
