import User from '#models/user'
import {
  createUserValidator,
  deleteUserValidator,
  editUserValidator,
  updateUserValidator,
} from '#validators/admin/user'
import type { HttpContext } from '@adonisjs/core/http'

const Permissions = User.permissions.map((permission) => ({
  name: permission.replaceAll(':', '-'),
  value: permission,
}))

export default class AccountsController {
  /**
   * Display a list of resource
   */
  async index({ bouncer, view }: HttpContext) {
    await bouncer.with('UsersPolicy').authorize('manage')
    const users = await User.query().orderBy('id', 'asc')

    return view.render('admin/accounts/index', {
      accounts: users.map((user) => user.serialize()),
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ bouncer, view }: HttpContext) {
    await bouncer.with('UsersPolicy').authorize('manage')

    return view.render('admin/accounts/create', {
      availablePermissions: Permissions,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, bouncer, session }: HttpContext) {
    await bouncer.with('UsersPolicy').authorize('manage')

    const data = await request.validateUsing(createUserValidator)
    const newUser = await User.create({
      ...data,
      isAdmin: !!data.isAdmin,
      permissions: data.isAdmin ? [] : (data.permissions ?? []),
    })

    session.flash('notification', {
      type: 'success',
      message: 'User created successfully!',
    })

    return response.redirect().toRoute('admin.accounts.edit', { id: newUser.id })
  }

  /**
   * Edit individual record
   */
  async edit({ request, bouncer, view }: HttpContext) {
    await bouncer.with('UsersPolicy').authorize('manage')

    const { params } = await request.validateUsing(editUserValidator)
    const user = await User.findOrFail(params.id)

    return view.render('admin/accounts/edit', {
      account: user.serialize(),
      availablePermissions: Permissions,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, auth, bouncer, session }: HttpContext) {
    await bouncer.with('UsersPolicy').authorize('manage')

    const { params, ...data } = await request.validateUsing(updateUserValidator, {
      meta: {
        user_id: Number.parseInt(request.param('id')),
      },
    })

    if (!data.isAdmin) {
      const hasOtherAdmins = await User.hasOtherAdmins(params.id)
      if (!hasOtherAdmins) {
        session.flash('notification', {
          type: 'error',
          message: 'The server needs at least one administrator',
        })

        return response.redirect().back()
      }
    }

    const user = await User.findOrFail(params.id)
    const updatedUser = user.merge({
      ...data,
      isAdmin: !!data.isAdmin,
      permissions: data.isAdmin ? [] : (data.permissions ?? []),
    })

    if (!updatedUser.isDirty()) {
      session.flash('notification', {
        type: 'info',
        message: 'No changes made were to the account.',
      })

      return response.redirect().back()
    }

    await updatedUser.save()

    session.flash('notification', {
      type: 'success',
      message: 'Account updated successfully!',
    })

    if (updatedUser.id !== auth.user!.id || updatedUser.isAdmin) {
      return response.redirect().toRoute('admin.accounts.edit', { id: params.id })
    }

    return response.redirect().toRoute('admin.overview')
  }

  /**
   * Delete record
   */
  async destroy({ request, response, session, auth, bouncer }: HttpContext) {
    await bouncer.with('UsersPolicy').authorize('manage')

    const { params } = await request.validateUsing(deleteUserValidator)
    const user = await User.findOrFail(params.id)

    if (user.id === auth.user!.id) {
      session.flash('notification', {
        type: 'error',
        message: 'You cannot delete your own user account.',
      })

      return response.redirect().back()
    }

    if (user.isAdmin) {
      const hasOtherAdmins = await User.hasOtherAdmins(params.id)
      if (!hasOtherAdmins) {
        session.flash('notification', {
          type: 'error',
          message: 'The server needs at least one administrator',
        })

        return response.redirect().back()
      }
    }

    await user.delete()
    session.flash('notification', {
      type: 'success',
      message: 'User deleted successfully',
    })

    return response.redirect().toRoute('admin.accounts.index')
  }
}
