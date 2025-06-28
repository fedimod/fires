import edge from 'edge.js'
import env from '#start/env'
import locales from '#config/locales'
import markdown from '#utils/markdown'
import { UrlService } from '#services/url_service'
import { DateTime } from 'luxon'

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
