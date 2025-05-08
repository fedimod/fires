import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthenticationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.auth.hasToken()) {
      return ctx.auth.fail()
    }

    return next()
  }
}
