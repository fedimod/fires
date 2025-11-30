import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class SettingsPolicy extends BasePolicy {
  manage(user: User): AuthorizerResponse {
    return user.isAdmin || user.permissions.includes('settings:manage')
  }
}
