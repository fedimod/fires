import Label from '#models/label'
import markdown from '#utils/markdown'
import { DateTime } from 'luxon'
import { XSDDateFormat } from '#utils/jsonld'
import { UrlService } from '#services/url_service'

interface LabelType {
  '@context'?: (string | Record<string, string>)[]
  'id': string
  'url': string
  'context': string
  'type': 'Label'
  'name': string
  'published': string
  'updated'?: string
  'content'?: string
  'summary'?: string
  'owl:deprecated'?: boolean
}

export const CONTEXT = [
  'https://www.w3.org/ns/activitystreams',
  {
    owl: 'http://www.w3.org/2002/07/owl#',
    Label: 'https://fires.fedimod.org/ns#Label',
  },
]

export class LabelsSerializer {
  async collection(labels: Label[]) {
    const latest = await Label.query()
      .select('id', 'updatedAt')
      .orderBy('updatedAt', 'desc')
      .first()

    const collectionId = UrlService.make('labels.index')

    return {
      '@context': CONTEXT,
      'summary': `Labels from ${UrlService.publicUrl}`,
      'type': 'Collection',
      'id': collectionId,
      'url': collectionId,
      'updated': latest?.updatedAt.toFormat(XSDDateFormat),
      'totalItems': labels.length,
      'items': labels.map((item) => this.singular(item, collectionId)),
    }
  }

  singular(item: Label, collectionId?: string) {
    const result: Partial<LabelType> = {}

    if (item.deprecatedAt && item.deprecatedAt < DateTime.now()) {
      result['owl:deprecated'] = true
    }

    result.id = UrlService.make('protocol.labels.show', { id: item.id })
    result.url = UrlService.make('labels.show', { slug: item.slug })
    result.type = 'Label'
    result.name = item.name
    result.context = collectionId ?? UrlService.make('labels.index')
    result.published = item.createdAt.toFormat(XSDDateFormat)
    if (item.updatedAt !== null) {
      result.updated = item.updatedAt.toFormat(XSDDateFormat)
    }

    if (item.summary) result.summary = item.summary
    if (item.description) result.content = markdown.render(item.description)

    return result
  }
}
