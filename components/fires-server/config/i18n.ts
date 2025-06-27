import app from '@adonisjs/core/services/app'
import { defineConfig, formatters, loaders } from '@adonisjs/i18n'
import env from '#start/env'

const i18nConfig = defineConfig({
  defaultLocale: env.get('DEFAULT_LOCALE', 'en-US'),
  supportedLocales: ['en-US'],

  formatter: formatters.icu(),

  loaders: [
    /**
     * The fs loader will read translations from the
     * "resources/locales" directory.
     *
     * Each subdirectory represents a locale. For example:
     *   - "resources/locales/en"
     *   - "resources/locales/fr"
     *   - "resources/locales/it"
     */
    loaders.fs({
      location: app.languageFilesPath(),
    }),
  ],
})

export default i18nConfig
