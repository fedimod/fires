import env from '#start/env'
import router from '@adonisjs/core/services/router'

export class UrlService {
  make(route: string, params?: any[] | Record<string, any>) {
    return new URL(router.makeUrl(route, params), env.get('PUBLIC_URL')).href
  }

  get publicUrl() {
    return new URL(env.get('PUBLIC_URL')).href
  }
}
