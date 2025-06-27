import { DateTime } from 'luxon'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import { UuidBaseModel } from '#utils/lucid_extensions'
import Label from '#models/label'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class LabelTranslation extends UuidBaseModel {
  selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare labelId: string

  @belongsTo(() => Label)
  declare label: BelongsTo<typeof Label>

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
}
