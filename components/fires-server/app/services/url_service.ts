import env from '#start/env'
import { Router } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class UrlService {
  static make(...args: Parameters<Router['makeUrl']>) {
    return new URL(router.makeUrl(...args), env.get('PUBLIC_URL')).href
  }

  static get publicUrl() {
    return new URL(env.get('PUBLIC_URL')).href
  }
}
