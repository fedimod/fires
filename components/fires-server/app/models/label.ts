import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { v7 as uuidv7 } from 'uuid'

export default class Label extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare language: string

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
}
