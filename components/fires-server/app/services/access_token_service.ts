import AccessToken from '#models/access_token'
import string from '@adonisjs/core/helpers/string'
import crypto from 'node:crypto'
import { appKey } from '#config/app'
import { safeEqual, Secret } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'

export type Ability = 'read' | 'write' | 'admin'

export const TOKEN_PREFIX = 'fires_'
export const IDENTIFIER_LENGTH = 32
// 1 day in milliseconds:
const TOKEN_TOUCH_INTERVAL = 24 * 60 * 60

export default class AccessTokenService {
  static mint() {
    const identifier = string.random(IDENTIFIER_LENGTH)
    const hmac = createHmac(identifier)

    return new Secret(`${TOKEN_PREFIX}${identifier}.${hmac}`)
  }

  static async create(abilities: Ability[], description: string) {
    return AccessToken.create({
      token: this.mint(),
      abilities,
      description,
      lastUsedAt: null,
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

    const verifiedHmac = createHmac(identifier)
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
    if (token.lastUsedAt === undefined || token.lastUsedAt === null) {
      touch = true
    }

    if (token.lastUsedAt !== undefined && token.lastUsedAt !== null) {
      const now = DateTime.now()
      const minLastUsedAt = now.minus({ seconds: TOKEN_TOUCH_INTERVAL })
      const lastUsedAt = token.lastUsedAt

      // If the token was last used over a day ago, or the token was last used
      // somehow in the future, touch the lastUsedAt timestamp
      touch = lastUsedAt < minLastUsedAt || lastUsedAt > now
    }

    if (touch) {
      await token.merge({ lastUsedAt: DateTime.now() }).save()
    }
  }
}

export function createHmac(value: string): string {
  return crypto.createHmac('sha256', appKey.release()).update(value).digest('base64url')
}
