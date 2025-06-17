import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RequireTokenAuthenticationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.token.exists()) {
      return ctx.token.fail()
    }

    return next()
  }
}
