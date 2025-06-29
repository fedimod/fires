import app from '@adonisjs/core/services/app'
import { defineConfig, store, drivers } from '@adonisjs/cache'

const cacheConfig = defineConfig({
  default: app.inTest ? 'memoryOnly' : 'database',

  stores: {
    memoryOnly: store().useL1Layer(drivers.memory()),

    database: store().useL2Layer(
      drivers.database({
        connectionName: 'postgres',
      })
    ),
  },
})

export default cacheConfig

declare module '@adonisjs/cache/types' {
  interface CacheStores extends InferStores<typeof cacheConfig> {}
}
