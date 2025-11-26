import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler, Response } from '@adonisjs/core/http'
import { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import { errors as lucid } from '@adonisjs/lucid'
import { errors as limiter } from '@adonisjs/limiter'

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

  private setRateLimitHeaders(response: Response, error: limiter.ThrottleException) {
    const headers = error.getDefaultHeaders()
    Object.keys(headers).forEach((header) => {
      response.header(header, headers[header])
    })
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    return ctx.response.vary('Accept').negotiate(
      {
        json: async () => {
          if (error instanceof lucid.E_ROW_NOT_FOUND) {
            return ctx.response.status(404).json({ error: 'not_found' })
          }

          if (error instanceof limiter.E_TOO_MANY_REQUESTS) {
            this.setRateLimitHeaders(ctx.response, error)

            return ctx.response
              .status(error.status)
              .json({ error: 'too_many_requests', message: error.getResponseMessage(ctx) })
          }

          return super.handle(error, ctx)
        },
        html: async () => {
          if (error instanceof limiter.E_TOO_MANY_REQUESTS) {
            this.setRateLimitHeaders(ctx.response, error)

            const response = await ctx.view.render('errors/rate-limited', {
              message: error.getResponseMessage(ctx),
              duration: Math.ceil(error.response.availableIn / 60),
            })

            return ctx.response.status(error.status).send(response)
          }

          return super.handle(error, ctx)
        },
      },
      { defaultHandler: 'json' }
    )
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

    // Don't report rate limit errors:
    if (error instanceof limiter.E_TOO_MANY_REQUESTS) {
      return
    }

    return super.report(error, ctx)
  }
}
