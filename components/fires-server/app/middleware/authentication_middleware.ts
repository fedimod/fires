import AccessToken from '#models/access_token'
import AccessTokenService from '#services/access_token_service'
import { type HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthenticationMiddleware {
  REALM = 'FIRES'
  AUTH_SCHEME = 'Bearer '

  async handle(ctx: HttpContext, next: NextFn) {
    ctx.token = null

    const authorization = ctx.request.header('authorization', '')
    if (!authorization?.startsWith(this.AUTH_SCHEME)) {
      return ctx.response.unauthenticated(this.REALM)
    }

    const unverifiedToken = authorization.slice(this.AUTH_SCHEME.length).trim()
    if (unverifiedToken.length === 0) {
      return ctx.response.unauthenticated(this.REALM)
    }

    const accessToken = await AccessTokenService.verify(unverifiedToken)
    if (accessToken === null) {
      return ctx.response.unauthenticated(this.REALM, {
        error: 'invalid_token',
        error_description: 'The access token is not valid',
      })
    }

    await AccessTokenService.touch(accessToken)

    ctx.token = accessToken

    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    token: AccessToken | null
  }
}
