import type { HttpContext } from '@adonisjs/core/http'
import { UrlService } from '#services/url_service'
import { inject } from '@adonisjs/core'
import { SoftwareService } from '#services/software_service'

@inject()
export default class NodeInfoController {
  constructor(
    protected urlService: UrlService,
    protected softwareService: SoftwareService
  ) {}

  async discovery({ response }: HttpContext) {
    return response.json({
      links: [
        {
          rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1',
          href: this.urlService.makeUrl('nodeinfo.retrieval'),
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
      version: '2.1',
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
      usage: {},
      metadata: {},
    })
  }
}

export type NodeInfoDiscovery = {
  links: NodeInfoDiscoveryLink[]
}

export type NodeInfoDiscoveryLink = {
  rel: string
  href: string
}

export type NodeInfo = {
  version: '2.1'
  software: {
    name: string
    version: string
    homepage?: string
    repository?: string
  }
  protocols: string[]
  services: {
    inbound: string[]
    outbound: string[]
  }
  openRegistrations: boolean
  usage: Record<string, any>
  metadata: Record<string, any>
}
