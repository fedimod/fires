import { Response, ResponseStatus } from '@adonisjs/core/http'

Response.macro(
  'unauthenticated',
  function (this: Response, realm: string, params: Record<string, string> = {}) {
    params.realm = realm
    const challenge = Object.keys({ ...params }).reduce((result, param, idx, keys) => {
      result += `${param}=${JSON.stringify(String(params[param]))}`
      if (idx < keys.length - 1) {
        result += ', '
      }
      return result
    }, 'Bearer ')

    console.log(challenge)
    this.status(ResponseStatus.Unauthorized)
      .header('WWW-Authenticate', challenge)
      .send(JSON.stringify(params))
  }
)

declare module '@adonisjs/core/http' {
  interface Response {
    unauthenticated(realm: string, params?: Record<string, string>): void
  }
}
