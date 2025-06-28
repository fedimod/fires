import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import { errors } from '@adonisjs/lucid'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected renderStatusPages = app.inProduction
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (_, { view }) => view.render('errors/not-found'),
    '500..599': (_, { view }) => view.render('errors/server-error'),
  }

  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    return ctx.response.negotiate({
      json: async () => {
        if (error instanceof errors.E_ROW_NOT_FOUND) {
          return ctx.response.status(404).json({ error: 'not_found' })
        }

        return super.handle(error, ctx)
      },
      html: async () => {
        return super.handle(error, ctx)
      },
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    if (app.inDev) {
      ctx.logger.error(error)
    }
    return super.report(error, ctx)
  }
}
