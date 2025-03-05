import logger from '@adonisjs/core/services/logger'
import { MissingTranslationEventPayload } from '@adonisjs/i18n/types'

export default class Localization {
  handleMissing(event: MissingTranslationEventPayload) {
    logger.error(`i18n error: missing ${event.locale} translation for: ${event.identifier}`, event)
  }
}
