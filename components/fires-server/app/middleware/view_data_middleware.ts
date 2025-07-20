import Dataset from '#models/dataset'
import Label from '#models/label'
import Setting from '#models/setting'
import { SoftwareService } from '#services/software_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'
import cache from '@adonisjs/cache/services/main'

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
      const configuration = await this.getConfiguration()
      const softwareInfo = await this.softwareService.getMetadata()

      ctx.view.share({
        provider: {
          name: configuration.name,
          summary: configuration.summary,
        },
        software: softwareInfo,
        hasLabels: configuration.hasLabels,
        hasDatasets: configuration.hasDatasets,
      })
    }

    return await next()
  }

  private getConfiguration() {
    return cache.getOrSet({
      key: `configuration`,
      tags: ['labels', 'datasets'],
      factory: async () => {
        const settings = await Setting.retrieveSettings(['name', 'summary'])
        const labelsCount = await db.from(Label.table).count('* as total')
        const datasetsCount = await db.from(Dataset.table).count('* as total')

        return {
          name: settings.name || 'FediMod FIRES Server',
          summary:
            settings.summary ||
            'An server for labels, moderation advisories, and moderation recommendations.',
          hasLabels: Number.parseInt(labelsCount[0].total, 10) > 0,
          hasDatasets: Number.parseInt(datasetsCount[0].total, 10) > 0,
        }
      },
      ttl: '60m',
    })
  }
}
