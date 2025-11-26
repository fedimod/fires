import { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'

export const throttle = limiter.define('global', (ctx: HttpContext) => {
  if (ctx.auth.user) {
    return limiter.allowRequests(500).every('5 minutes').usingKey(`user_${ctx.auth.user.id}`)
  }

  return limiter.allowRequests(100).every('5 minutes').usingKey(`ip_${ctx.request.ip()}`)
})

export const throttleExports = limiter.define('exports', (ctx) => {
  return limiter
    .allowRequests(2)
    .every('10 minutes')
    .blockFor('30 minutes')
    .usingKey(`ip_${ctx.request.ip()}_${ctx.params.dataset_id}`)
})
