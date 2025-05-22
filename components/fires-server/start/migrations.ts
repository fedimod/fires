import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'

import { MigrationRunner } from '@adonisjs/lucid/migration'
import env from '#start/env'

if (app.getEnvironment() === 'web') {
  logger.info(
    { shouldAutoMigrate: env.get('DATABASE_AUTOMIGRATE', false) },
    'Checking for auto-migration'
  )

  if (env.get('DATABASE_AUTOMIGRATE', false) === true) {
    const migrator = new MigrationRunner(db, app, {
      direction: 'up',
      dryRun: false,
    })

    migrator.on('start', () => {
      logger.info('Running database migrations')
    })

    migrator.on('migration:completed', (migration) => {
      logger.info(`Migration ${migration.status}: ${migration.file.name}`)
    })

    migrator.on('migration:error', (migration) => {
      logger.error(`Migration ${migration.status}: ${migration.file.name}`)
    })

    migrator.on('end', () => {
      logger.info('Migrations finished')
    })

    await migrator.run()
  }
}
