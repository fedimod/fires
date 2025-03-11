import AccessToken from '#models/access_token'
import AccessTokenService from '#services/access_token_service'
import { ResponseStatus, type HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthenticationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    ctx.auth = new AuthProvider(ctx)

    const authorization = ctx.request.header('authorization', '')
    if (!authorization) {
      return next()
    }

    if (!authorization?.startsWith(ctx.auth.SCHEME)) {
      return ctx.auth.fail()
    }

    const unverifiedToken = authorization.slice(ctx.auth.SCHEME.length).trim()
    if (unverifiedToken.length === 0) {
      return ctx.auth.fail()
    }

    const accessToken = await AccessTokenService.verify(unverifiedToken)
    if (accessToken === null) {
      return ctx.auth.fail({
        error: 'invalid_token',
        error_description: 'The access token is not valid',
      })
    }

    await AccessTokenService.touch(accessToken)

    ctx.auth.setToken(accessToken)

    return next()
  }
}

export class AuthProvider {
  REALM = 'FIRES'
  SCHEME = 'Bearer '

  protected token?: AccessToken
  protected ctx: HttpContext

  constructor(ctx: HttpContext) {
    this.ctx = ctx
  }

  fail(params: Record<string, string> = {}) {
    const challengeParameters = Object.keys(params)
      .map((param) => {
        return `${param}=${JSON.stringify(String(params[param]))}`
      })
      .join(', ')

    const challenge = `Bearer realm="${this.REALM}"${challengeParameters.length ? ', ' + challengeParameters : ''}`

    this.ctx.response
      .status(ResponseStatus.Unauthorized)
      .header('WWW-Authenticate', challenge)
      .send(JSON.stringify(params))
  }

  insufficientScope() {
    return this.fail({
      error: 'insufficient_scope',
      error_description: 'You do not have sufficient scope to access this endpoint',
    })
  }

  setToken(token: AccessToken) {
    this.token = token
  }

  hasToken() {
    return this.token !== undefined
  }

  hasAbility(ability: string): boolean {
    if (this.token) {
      return this.token.abilities.includes(ability)
    }
    return false
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    auth: AuthProvider
  }
}
