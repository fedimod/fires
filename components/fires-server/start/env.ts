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

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
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
  DATABASE_HOST: Env.schema.string({ format: 'host' }),
  DATABASE_PORT: Env.schema.number(),
  DATABASE_USER: Env.schema.string(),
  DATABASE_PASSWORD: Env.schema.string.optional(),
  DATABASE_NAME: Env.schema.string.optional(),
  DATABASE_SSL_CA_CERT: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the FIRES server
  |----------------------------------------------------------
  */
  DEFAULT_LOCALE: Env.schema.string.optional(),
})
