import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class LabelsPolicy extends BasePolicy {
  manage(user: User): AuthorizerResponse {
    return user.isAdmin || user.permissions.includes('labels:manage')
  }
}
