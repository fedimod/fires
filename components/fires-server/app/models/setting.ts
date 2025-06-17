import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Setting extends BaseModel {
  @column({ isPrimary: true })
  declare key: string

  @column()
  declare value: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async retrieveSettings(keys: string[]): Promise<Record<string, string>> {
    const rows = await this.findMany(keys)
    return rows.reduce<Record<string, string>>((settings, record) => {
      settings[record.key] = record.value
      return settings
    }, {})
  }
}
