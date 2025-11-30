import Setting from '#models/setting'
import { settingsValidator } from '#validators/admin/settings'
import cache from '@adonisjs/cache/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class SettingsController {
  private KEYS = [
    'name',
    'summary',
    'description',
    'contact_email',
    'appeals_url',
    'documentation_url',
  ]

  /**
   * Show individual record
   */
  async show({ view, bouncer }: HttpContext) {
    await bouncer.with('SettingsPolicy').authorize('manage')

    const settings = await Setting.retrieveSettings(this.KEYS)

    return view.render('admin/settings', {
      settings,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, session, bouncer }: HttpContext) {
    await bouncer.with('SettingsPolicy').authorize('manage')

    const form = await request.validateUsing(settingsValidator)
    const updatedSettings = this.KEYS.map((key) => {
      // Allow arbitrary access into the form object:
      const value = form[key as keyof typeof form] ?? ''

      return {
        key,
        value,
      }
    })

    await Setting.updateOrCreateMany('key', updatedSettings)
    await cache.delete({ key: 'configuration' })

    session.flash('notification', {
      type: 'success',
      message: 'Server settings have been successfully updated!',
    })

    return response.redirect().toRoute('admin.settings')
  }
}
