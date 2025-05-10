import { parse, toClientConfig } from 'pg-connection-string'
import { defineConfig } from '@adonisjs/lucid'
import app from '@adonisjs/core/services/app'

import env from '#start/env'

const connectionOptions = parse(env.get('DATABASE_URL'), { useLibpqCompat: true })
if (connectionOptions.database === null) {
  connectionOptions.database = `fires_${env.get('NODE_ENV')}`
}

const clientConfig = toClientConfig(connectionOptions)

const dbConfig = defineConfig({
  connection: 'postgres',
  prettyPrintDebugQueries: !app.inProduction,

  connections: {
    postgres: {
      client: 'pg',
      connection: clientConfig,
      pool: {
        max: env.get('DATABASE_POOL_MAX', 2),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: !app.inProduction,
    },
  },
})

export default dbConfig
