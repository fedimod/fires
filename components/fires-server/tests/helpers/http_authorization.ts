import AccessToken from '#models/access_token'
import AccessTokenService, { Ability } from '#services/access_token_service'

export async function createToken(abilities: Ability[]) {
  return await AccessTokenService.create(abilities, `Test: ${abilities.join(', ')}`)
}

export function getAuthorizationHeader(token: AccessToken) {
  return `Bearer ${token.token.release()}`
}
