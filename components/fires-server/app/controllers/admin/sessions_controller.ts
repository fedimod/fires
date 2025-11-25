import type { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'
import limiter from '@adonisjs/limiter/services/main'
import User from '#models/user'
import { loginValidator } from '#validators/session'

export default class SessionController {
  async login({ request, response, view }: HttpContext) {
    const returnPath = request.input('returnPath')

    if (returnPath) {
      const decrypted = encryption.decrypt(returnPath)
      if (!decrypted) {
        return response.redirect().toRoute('admin.login')
      }
    }

    return view.render('admin/login', {
      returnPath: returnPath,
    })
  }

  async performLogin({ request, response, auth, session, i18n }: HttpContext) {
    const [validationError, data] = await loginValidator.tryValidate(request.all())
    if (validationError) {
      session.flashAll()
      session.flashErrors({
        E_INVALID_CREDENTIALS: i18n.t('errors.E_INVALID_CREDENTIALS'),
      })
      return response.redirect().back()
    }

    const loginLimiter = limiter.multi([
      { duration: '1 min', requests: 10, key: `login_${request.ip()}` },
      {
        duration: '1 min',
        requests: 5,
        blockDuration: '20 mins',
        key: `login_${request.ip()}_${data.username}`,
      },
    ])

    const [error, user] = await loginLimiter.penalize(() => {
      return User.verifyCredentials(data.username, data.password)
    })

    if (error || !user) {
      session.flashAll()
      if (error) {
        session.flashErrors({
          E_TOO_MANY_REQUESTS: i18n.t('errors.LOGIN_RATE_LIMITED', {
            duration: Math.ceil(error.response.availableIn / 60),
          }),
        })
      } else {
        session.flashErrors({
          E_INVALID_CREDENTIALS: i18n.t('errors.E_INVALID_CREDENTIALS'),
        })
      }

      return response.redirect().back()
    }

    await auth.use('admin').login(user)

    // Handle the encrypted return path, which is present via the login form:
    const returnPath = encryption.decrypt<string>(data.returnPath)
    if (returnPath !== null) {
      response.redirect().toPath(`/admin/${returnPath}`)
    } else {
      response.redirect().toRoute('admin.overview')
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('admin').logout()

    response.redirect().toRoute('admin.login')
  }
}
