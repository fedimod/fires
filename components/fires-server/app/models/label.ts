import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'
import { v7 as uuidv7 } from 'uuid'

export default class Label extends BaseModel {
  @column({ isPrimary: true })
  @ApiProperty({ name: 'id' })
  declare id: string

  @column()
  @ApiProperty({ name: 'language' })
  declare language: string

  @column()
  @ApiProperty({ name: 'name' })
  declare name: string

  @column()
  @ApiProperty({ name: 'summary' })
  declare summary: string

  @column()
  @ApiProperty({ name: 'description' })
  declare description: string

  @column.dateTime()
  @ApiProperty({ name: 'deprecatedAt' })
  declare deprecatedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  @ApiProperty({ name: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  @ApiProperty({ name: 'updatedAt' })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignId(label: Label) {
    label.id = uuidv7()
  }
}
