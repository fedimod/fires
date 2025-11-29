import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import db from '@adonisjs/lucid/services/db'
import { jsonArrayColumn } from '#utils/lucid_extensions'
import { DateTime } from 'luxon'

const AuthFinder = withAuthFinder(() => hash.use('argon2'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export const permissions = [
  'settings:manage',
  'labels:manage',
  'datasets:manage',
  'datasets:change',
  'datasets:import',
] as const

export type Permissions = (typeof permissions)[number]

export default class User extends compose(BaseModel, AuthFinder) {
  static permissions = permissions

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare isAdmin: boolean

  @jsonArrayColumn()
  declare permissions: Permissions[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async userCount(): Promise<number> {
    const { count } = await db.from(User.table).count('id', 'count').first()
    return Number.parseInt(count, 10)
  }

  static async hasOtherAdmins(id: number): Promise<boolean> {
    const otherAdmin = await db
      .from(User.table)
      .where({ is_admin: true })
      .whereNot('id', id)
      .first()

    return otherAdmin !== null
  }
}
