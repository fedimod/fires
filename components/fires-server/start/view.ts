import edge from 'edge.js'
import locales from '#config/locales'
import markdown from '#utils/markdown'
import { UrlService } from '#services/url_service'

edge.global('route_url', (...args: Parameters<typeof UrlService.make>) => {
  return UrlService.make(...args)
})

edge.global('markdown', (value: string) => {
  return edge.globals.html.safe(markdown.render(value))
})

edge.global('isInputInvalid', (name: string, flashMessages: any) => {
  return flashMessages.get('inputErrorsBag', {})[name] ? 'is-invalid' : ''
})

edge.global('locales', locales)
