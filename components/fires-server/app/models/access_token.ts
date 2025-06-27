import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import { Secret } from '@adonisjs/core/helpers'
import { jsonArrayColumn, secretColumn, UuidBaseModel } from '#utils/lucid_extensions'

export default class AccessToken extends UuidBaseModel {
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
}
