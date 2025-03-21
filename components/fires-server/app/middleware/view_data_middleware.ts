import Setting from '#models/setting'
import { SoftwareService } from '#services/software_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

@inject()
export default class ViewDataMiddleware {
  constructor(protected softwareService: SoftwareService) {}

  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.request.header('Accept') || ctx.request.accepts(['html', '*/*']) === 'html') {
      const [name, summary] = await Setting.findMany(['name', 'summary'])

      ctx.view.share({
        provider: {
          name: name?.value ?? 'FediMod FIRES Server',
          summary:
            summary?.value ??
            'An server for labels, moderation advisories, and moderation recommendations.',
        },
        software: await this.softwareService.getMetadata(),
      })
    }

    return await next()
  }
}
