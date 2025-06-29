import emitter from '@adonisjs/core/services/emitter'

const LocalizationListener = () => import('#listeners/localization')
const CacheListener = () => import('#listeners/cache')

emitter.on('i18n:missing:translation', [LocalizationListener, 'handleMissing'])

emitter.on('cache:cleared', [CacheListener, 'cleared'])
emitter.on('cache:deleted', [CacheListener, 'deleted'])
emitter.on('cache:hit', [CacheListener, 'hit'])
emitter.on('cache:miss', [CacheListener, 'miss'])
