import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { Secret } from '@adonisjs/core/helpers'
import { jsonArrayColumn, secretColumn } from '#utils/lucid_extensions'
import { v7 as uuidv7 } from 'uuid'

export default class AccessToken extends BaseModel {
  selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @secretColumn()
  declare token: Secret<string>

  @column()
  declare description: string

  @jsonArrayColumn()
  declare abilities: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare lastUsedAt: DateTime | null

  @beforeCreate()
  static assignId(accessToken: AccessToken) {
    accessToken.id = uuidv7()
  }
}
