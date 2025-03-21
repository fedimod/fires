import type { HttpContext } from '@adonisjs/core/http'
import { UrlService } from '#services/url_service'
import { inject } from '@adonisjs/core'
import { SoftwareService } from '#services/software_service'

@inject()
export default class AboutController {
  constructor(
    protected urlService: UrlService,
    protected softwareService: SoftwareService
  ) {}

  async discovery({ response }: HttpContext) {
    return response.json({
      links: [
        {
          rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1',
          href: this.urlService.makeUrl('nodeinfo.retrieve'),
        },
      ],
    })
  }

  async retrieval({ response }: HttpContext) {
    response.header(
      'content-type',
      'application/json; profile="http://nodeinfo.diaspora.software/ns/schema/2.1#"'
    )

    const softwareMetadata = await this.softwareService.getMetadata()

    return response.json({
      version: 'v2.1',
      software: {
        name: softwareMetadata.slug,
        homepage: softwareMetadata.homepage,
        repository: softwareMetadata.repository,
        version: softwareMetadata.version,
      },
      protocols: ['fires'],
      services: {
        inbound: [],
        outbound: [],
      },
      openRegistrations: false,
      // no usage data
      metadata: {},
    })
  }
}
