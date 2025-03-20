import Label from '#models/label'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import markdown from '#utils/markdown'
import { DateTime } from 'luxon'
import { XSDDateFormat } from '#utils/jsonld'

interface LabelType {
  '@context'?: (string | Record<string, string>)[]
  'id': string
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
  static async collection(labels: Label[]) {
    const latest = await Label.query()
      .select('id', 'updatedAt')
      .orderBy('updatedAt', 'desc')
      .first()

    const collectionId = new URL(router.makeUrl('labels.index'), env.get('PUBLIC_URL')).href

    return {
      '@context': CONTEXT,
      'summary': `Labels from ${env.get('PUBLIC_URL')}`,
      'type': 'Collection',
      'id': collectionId,
      'updated': latest?.updatedAt.toFormat(XSDDateFormat),
      'totalItems': labels.length,
      'items': labels.map((item) => this.singular(item, collectionId)),
    }
  }

  static singular(item: Label, collectionId: string) {
    const result: Partial<LabelType> = {}

    if (item.deprecatedAt && item.deprecatedAt < DateTime.now()) {
      result['owl:deprecated'] = true
    }

    result.id = new URL(router.makeUrl('labels.show', { id: item.id }), env.get('PUBLIC_URL')).href
    result.type = 'Label'
    result.name = item.name
    result.context = collectionId
    result.published = item.createdAt.toFormat(XSDDateFormat)
    if (item.updatedAt !== null) {
      result.updated = item.updatedAt.toFormat(XSDDateFormat)
    }

    if (item.summary) result.summary = item.summary
    if (item.description) result.content = markdown.render(item.description)

    return result
  }
}
