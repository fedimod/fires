import Setting from '#models/setting'
import markdown from '#utils/markdown'
import cache from '@adonisjs/cache/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class AboutController {
  async index({ view }: HttpContext) {
    const settings = await this.getSettings()

    console.log(typeof settings.description, settings)

    return view.render('about/index', {
      description: settings.description,
      documentation_url: settings.documentation_url,
      appeals_url: settings.appeals_url,
    })
  }

  private getSettings() {
    return cache.getOrSet({
      key: `settings:about`,
      tags: ['settings'],
      factory: async () => {
        const settings = await Setting.retrieveSettings([
          'description',
          'documentation_url',
          'appeals_url',
        ])

        return {
          description: settings.description
            ? markdown.render(settings.description)
            : 'This FIRES server is not yet configured correctly.',
          documentation_url: settings.documentation_url ?? null,
          appeals_url: settings.appeals_url ?? null,
        }
      },
      ttl: '60m',
    })
  }
}
