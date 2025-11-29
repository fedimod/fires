import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class DatasetsPolicy extends BasePolicy {
  manage(user: User): AuthorizerResponse {
    return user.isAdmin || user.permissions.includes('datasets:manage')
  }

  change(user: User): AuthorizerResponse {
    return user.isAdmin || user.permissions.includes('datasets:change')
  }

  import(user: User): AuthorizerResponse {
    return (
      user.isAdmin ||
      (user.permissions.includes('datasets:manage') && user.permissions.includes('datasets:import'))
    )
  }
}
