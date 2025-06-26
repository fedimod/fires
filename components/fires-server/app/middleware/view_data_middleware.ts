import Label from '#models/label'
import Setting from '#models/setting'
import { SoftwareService } from '#services/software_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class ViewDataMiddleware {
  constructor(protected softwareService: SoftwareService) {}

  excludedEndpoints = ['/.well-known/nodeinfo', '/nodeinfo/2.1', '/api/']

  async handle(ctx: HttpContext, next: NextFn) {
    if (this.excludedEndpoints.some((endpoint) => ctx.request.url().startsWith(endpoint))) {
      return await next()
    }

    // This is only needed if we're going to render a HTML page, which is when
    // the request is explicitly not a JSON request:
    if (!ctx.request.header('Accept') || ctx.request.accepts(['json', '*/*']) !== 'json') {
      const settings = await Setting.retrieveSettings(['name', 'summary'])
      const labelsCount = await db.from(Label.table).count('* as total')

      ctx.view.share({
        provider: {
          name: settings.name ?? 'FediMod FIRES Server',
          summary:
            settings.summary ??
            'An server for labels, moderation advisories, and moderation recommendations.',
        },
        software: await this.softwareService.getMetadata(),
        hasLabels: Number.parseInt(labelsCount[0].total, 10) > 0,
      })
    }

    return await next()
  }
}
