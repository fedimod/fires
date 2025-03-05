import emitter from '@adonisjs/core/services/emitter'

emitter.on('i18n:missing:translation', [() => import('#listeners/localization'), 'handleMissing'])
