import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import router from '@adonisjs/core/services/router'
import encryption from '@adonisjs/core/services/encryption'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AdminAuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/admin/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    const requestedUrl = ctx.request.url(true).slice(7)
    const loginRoute = this.getLoginRoute(requestedUrl)

    await ctx.auth.authenticateUsing(options.guards, { loginRoute })
    return next()
  }

  private getLoginRoute(requestedUrl: string) {
    if (requestedUrl && !requestedUrl.startsWith('overview')) {
      return router
        .builder()
        .qs({
          returnPath: encryption.encrypt(requestedUrl),
        })
        .make('admin.login')
    } else {
      return router.builder().make('admin.login')
    }
  }
}
