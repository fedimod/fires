import edge from 'edge.js'
import env from '#start/env'
import locales from '#config/locales'
import markdown from '#utils/markdown'
import UrlService from '#services/url_service'
import { DateTime } from 'luxon'
import DatasetChange, { EntityKind } from '#models/dataset_change'
import stringHelpers from '@adonisjs/core/helpers/string'
import { Permissions } from '#models/user'
import i18nManager from '@adonisjs/i18n/services/main'
import { isPunycoded, punycodeToUnicode } from '#utils/punycode'

edge.global('route_url', (...args: Parameters<typeof UrlService.make>) => {
  return UrlService.make(...args)
})

edge.global('namify', (value: string) => {
  return stringHelpers.slug(value, {
    replacement: '-',
    strict: true,
    lower: true,
  })
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

edge.global(
  'formatDate',
  (value: DateTime | Date | string | null, format: string = 'yyyy-MM-dd') => {
    if (value === null) {
      return ''
    }
    if (value instanceof DateTime) {
      return value.toFormat(format)
    }

    if (typeof value === 'string') {
      return DateTime.fromISO(value).toFormat(format)
    }

    if (typeof value === 'object' && value.constructor.name === 'Date') {
      return DateTime.fromJSDate(value).toFormat(format)
    }
  }
)

edge.global('formatPermissions', (permissions: Permissions[], locale: string) => {
  const i18n = i18nManager.locale(locale)
  return i18n.formatList(
    permissions.map((permission, idx) => {
      if (idx > 0) {
        return i18n.t(`admin.accounts.permissions.${permission}`).toLowerCase()
      } else {
        return i18n.t(`admin.accounts.permissions.${permission}`)
      }
    })
  )
})

edge.global('isEncoded', (kind: EntityKind, value: string): boolean => {
  let encoded = false

  // Domains can be punycode encoded if they contain special characters:
  if (kind === 'domain' && isPunycoded(value)) {
    encoded = true
  }

  // Actors are URLs:
  if (kind === 'actor') {
    const parsed = URL.parse(value)!
    // If the hostname is punycode encoded or the contains URL encoded
    // characters, then we're encoded and need to display a hint
    if ((parsed && isPunycoded(parsed.hostname)) || value.includes('%')) {
      encoded = true
    }
  }

  return encoded
})

edge.global('decodeEnitity', (kind: EntityKind, value: string) => {
  if (kind === 'domain') {
    return punycodeToUnicode(value)
  }

  if (kind === 'actor') {
    const parsed = URL.parse(value)
    // Sometimes the value can't be decoded by URL.parse
    if (!parsed) {
      return decodeURI(value)
    }
    return decodeURI(
      value.replace(`://${parsed.hostname}`, `://${punycodeToUnicode(parsed.hostname)}`)
    )
  }

  return value
})
