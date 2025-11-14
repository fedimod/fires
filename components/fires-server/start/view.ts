import edge from 'edge.js'
import env from '#start/env'
import locales from '#config/locales'
import markdown from '#utils/markdown'
import UrlService from '#services/url_service'
import { DateTime } from 'luxon'
import DatasetChange from '#models/dataset_change'

edge.global('route_url', (...args: Parameters<typeof UrlService.make>) => {
  return UrlService.make(...args)
})

edge.global('markdown', (value: string) => {
  return edge.globals.html.safe(markdown.render(value))
})

edge.global('toDate', (value: string) => {
  return DateTime.fromISO(value)
})

edge.global('isInputInvalid', (name: string, flashMessages: any) => {
  return flashMessages.get('inputErrorsBag', {})[name] ? 'is-invalid' : ''
})

edge.global('locales', locales)

edge.global('default_locale', env.get('DEFAULT_LOCALE'))
edge.global('entity_kinds', DatasetChange.entities)
edge.global('recommended_policies', DatasetChange.policies)
// These are the types that can be created by default, retraction and tombstone are special:
edge.global('change_types', ['advisory', 'recommendation'])

edge.global('formatDate', (value: DateTime | Date | string, format: string = 'yyyy-MM-dd') => {
  if (value instanceof DateTime) {
    return value.toFormat(format)
  }

  if (typeof value === 'string') {
    return DateTime.fromISO(value).toFormat(format)
  }

  if (typeof value === 'object' && value.constructor.name === 'Date') {
    return DateTime.fromJSDate(value).toFormat(format)
  }
})
