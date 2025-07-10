import { CacheEvents } from '@adonisjs/cache/types'
import logger from '@adonisjs/core/services/logger'

export default class Cache {
  cleared(event: CacheEvents['cache:cleared']) {
    logger.debug(`Cache: cleared ${event.store}`)
  }
  deleted(event: CacheEvents['cache:deleted']) {
    logger.debug(`Cache: deleted ${event.store}/${event.key}`)
  }
  hit(event: CacheEvents['cache:hit']) {
    logger.debug(`Cache: hit ${event.store}/${event.key}${event.graced ? ' (graced)' : ''}`)
  }
  miss(event: CacheEvents['cache:miss']) {
    logger.debug(`Cache: miss ${event.store}/${event.key}`)
  }
}
