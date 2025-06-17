import User from '#models/user'
import encryption from '@adonisjs/core/services/encryption'
import type { HttpContext } from '@adonisjs/core/http'

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

  async performLogin({ request, response, auth }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    // Handle the encrypted return path, which is present via the login form:
    const returnPath = encryption.decrypt(request.input('returnPath') ?? '')

    const user = await User.verifyCredentials(username, password)

    await auth.use('admin').login(user)

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
