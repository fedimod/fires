import { RequestListener } from 'node:http'
import { HttpContext } from '@adonisjs/core/http'
import { HttpContextFactory, RequestFactory, ResponseFactory } from '@adonisjs/core/factories/http'

import inject from 'light-my-request'

export function createMiddlewareInjectionTest(callback: (ctx: HttpContext) => Promise<void>) {
  const server: RequestListener = async (req, res) => {
    const request = new RequestFactory().merge({ req, res }).create()
    const response = new ResponseFactory().merge({ req, res }).create()
    const ctx = new HttpContextFactory().merge({ request, response }).create()

    await callback(ctx)

    if (!ctx.response.hasLazyBody) {
      ctx.response.send(null)
    }
    ctx.response.finish()
  }

  return inject(server)
}
