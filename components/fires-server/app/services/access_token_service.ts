import AccessToken from '#models/access_token'
import string from '@adonisjs/core/helpers/string'
import { createHmac } from 'node:crypto'
import { appKey } from '#config/app'
import { safeEqual, Secret } from '@adonisjs/core/helpers'

export type Ability = 'read' | 'write' | 'admin'

const TOKEN_PREFIX = 'fires_'
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

    return await AccessToken.findBy({ token: value })
  }

  private static createHmac(value: string): string {
    return createHmac('sha256', appKey.release()).update(value).digest('base64url')
  }
}
