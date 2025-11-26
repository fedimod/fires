import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class CookiesMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await next()

    const contentType = ctx.response.getHeader('Content-Type')?.toString()
    if (
      contentType?.startsWith('application/json') ||
      contentType?.startsWith('application/ld+json')
    ) {
      ctx.response.removeHeader('Set-Cookie')
    }
  }
}
