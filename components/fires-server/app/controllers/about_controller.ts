import Setting from '#models/setting'
import type { HttpContext } from '@adonisjs/core/http'

export default class AboutController {
  async index({ view }: HttpContext) {
    const settings = await Setting.retrieveSettings([
      'description',
      'documentation_url',
      'appeals_url',
    ])

    return view.render('about/index', {
      description: settings.description ?? 'This FIRES server is not yet configured correctly.',
      documentation_url: settings.documentation_url,
      appeals_url: settings.appeals_url,
    })
  }
}
