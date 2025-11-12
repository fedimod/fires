import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * This middleware ensures that any multipart requests do not make it through
 * and are immediately terminated before being parsed or handled in anyway
 */
export default class DisableMultipartRequestsMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const type = request.is(['multipart/form-data'])

    // Admin routes have authentication in front of them, as such we can safely
    // accept multipart form-data for those endpoints.
    if (type === 'multipart/form-data' && !request.url().startsWith('/admin')) {
      return response.status(400).json({ error: 'Bad request' })
    }

    return next()
  }
}
