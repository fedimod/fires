import Label from '#models/label'
import env from '#start/env'
import router from '@adonisjs/core/services/router'
import markdown from '#utils/markdown'
import { DateTime } from 'luxon'

interface LabelType {
  '@context'?: (string | Record<string, string>)[]
  'id': string
  'type': 'Label'
  'name': string
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
  static collection(labels: Label[]) {
    return {
      '@context': CONTEXT,
      'summary': `Labels from ${env.get('PUBLIC_URL')}`,
      'type': 'Collection',
      'id': new URL(router.makeUrl('labels.index'), env.get('PUBLIC_URL')).href,
      'totalItems': labels.length,
      'items': labels.map((item) => this.singular(item, false)),
    }
  }

  static singular(item: Label, includeContext: boolean = true) {
    const result: Partial<LabelType> = {}

    if (includeContext) {
      result['@context'] = CONTEXT
    }

    if (item.deprecatedAt && item.deprecatedAt < DateTime.now()) {
      result['owl:deprecated'] = true
    }

    result.id = new URL(router.makeUrl('labels.show', { id: item.id }), env.get('PUBLIC_URL')).href
    result.type = 'Label'
    result.name = item.name

    if (item.summary) result.summary = item.summary
    if (item.description) result.content = markdown.render(item.description)

    return result
  }
}
