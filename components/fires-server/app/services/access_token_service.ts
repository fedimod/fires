import AccessToken from '#models/access_token'
import string from '@adonisjs/core/helpers/string'
import { createHmac } from 'node:crypto'
import { appKey } from '#config/app'
import { safeEqual, Secret } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'

export type Ability = 'read' | 'write' | 'admin'

const TOKEN_PREFIX = 'fires_'
// 1 day in milliseconds:
const TOKEN_TOUCH_INTERVAL = 24 * 60 * 60 * 1000
const IDENTIFIER_LENGTH = 32

export default class AccessTokenService {
  static async create(abilities: Ability[], description: string) {
    const identifier = string.random(IDENTIFIER_LENGTH)
    const hmac = this.createHmac(identifier)

    return AccessToken.create({
      token: new Secret(`${TOKEN_PREFIX}${identifier}.${hmac}`),
      abilities,
      description,
    })
  }

  static async verify(value: string): Promise<AccessToken | null> {
    if (typeof value !== 'string' || !value.startsWith(TOKEN_PREFIX)) {
      return null
    }

    const token = value.slice(TOKEN_PREFIX.length)
    if (!token) {
      return null
    }

    const parts = token.split('.', 2)
    if (parts.length !== 2) {
      return null
    }

    const identifier = parts[0]
    const hmac = parts[1]
    if (identifier.length !== IDENTIFIER_LENGTH || hmac.length === 0) {
      return null
    }

    const verifiedHmac = this.createHmac(identifier)
    if (!safeEqual(verifiedHmac, hmac)) {
      return null
    }

    return await AccessToken.findBy('token', value)
  }

  /**
   * If the token hasn't been used within the last day, then we touch the
   * lastUsedAt column and save the token
   * @param token {AccessToken}
   */
  static async touch(token: AccessToken): Promise<void> {
    let touch = false
    // all AccessTokens start out unused, i.e., lastUsedAt is null
    if (token.lastUsedAt === null) {
      touch = true
    }

    if (!touch) {
      const now = Date.now()
      const lastUsedAt = token.lastUsedAt.toMillis()

      // If the token was last used over a day ago, or the token was last used
      // somehow in the future, touch the lastUsedAt timestamp
      touch = lastUsedAt < now - TOKEN_TOUCH_INTERVAL || lastUsedAt > now
    }

    if (touch) {
      token.lastUsedAt = DateTime.now()
      await token.save()
    }
  }

  private static createHmac(value: string): string {
    return createHmac('sha256', appKey.release()).update(value).digest('base64url')
  }
}
