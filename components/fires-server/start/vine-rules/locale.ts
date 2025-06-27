import locales from '#config/locales'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Implementation
 */
async function locale(value: unknown, _options: {}, field: FieldContext) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }

  if (!locales.includes(value)) {
    field.report('The {{ field }} field does not contain a valid locale', 'locale', field)
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const localeRule = vine.createRule(locale)
