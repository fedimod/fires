/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import locales from '#config/locales'
import { errors } from '@adonisjs/core'
import { Env } from '@adonisjs/core/env'

const env = await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const),

  /*
  |----------------------------------------------------------
  | Variables for server port/host
  |----------------------------------------------------------
  */
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  PUBLIC_URL: Env.schema.string({ format: 'url', tld: false }),

  /**
   * Build Metadata
   */
  SOURCE_BASE_URL: Env.schema.string.optional(),
  SOURCE_REPOSITORY: Env.schema.string.optional(),
  SOURCE_COMMIT: Env.schema.string.optional(),
  SOURCE_TAG: Env.schema.string.optional(),
  FIRES_VERSION_METADATA: Env.schema.string.optional(),
  FIRES_VERSION_PRERELEASE: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for encryption and hashing
  |----------------------------------------------------------
  */
  APP_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DATABASE_URL: Env.schema.string(),
  DATABASE_POOL_MAX: Env.schema.number.optional(),
  DATABASE_AUTOMIGRATE: Env.schema.boolean.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the FIRES server
  |----------------------------------------------------------
  */
  DEFAULT_LOCALE: Env.schema.string.optional(),
})

export default env

const locale = env.get('DEFAULT_LOCALE')
if (locale && !locales.includes(locale)) {
  throw new errors.E_INVALID_ENV_VARIABLES(
    'DEFAULT_LOCALE must be listed in the config/locales file'
  )
}
if (!locale) {
  env.set('DEFAULT_LOCALE', 'en-US')
}
