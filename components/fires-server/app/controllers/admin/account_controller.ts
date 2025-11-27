import { updateAccountValidator } from '#validators/admin/account'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccountController {
  async show({ view }: HttpContext) {
    return view.render('admin/account/manage')
  }

  async update({ request, response, auth, session }: HttpContext) {
    const user = await auth.use('admin').getUserOrFail()
    const data = await request.validateUsing(updateAccountValidator, {
      meta: {
        user_id: user.id,
      },
    })
    if (data.username === user.username && data.password === undefined) {
      session.flash('notification', {
        type: 'info',
        message: 'No changes made to username or password.',
      })

      return response.redirect().back()
    }

    if (data.username !== user.username) {
      user.merge({ username: data.username })
    }

    if (data.password) {
      user.merge({ password: data.password })
    }

    await user.save()

    session.flash('notification', {
      type: 'success',
      message: 'Account updated!',
    })

    return response.redirect().toRoute('admin.account.manage')
  }
}
