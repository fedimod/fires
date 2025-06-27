import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Directories
  |--------------------------------------------------------------------------
  |
  | These override some of the default directories for things in Adonis.js,
  | such as where the language files are stored.
  |
  */
  directories: {
    languageFiles: 'resources/locales',
  },

  /*
  |--------------------------------------------------------------------------
  | Commands
  |--------------------------------------------------------------------------
  |
  | List of ace commands to register from packages. The application commands
  | will be scanned automatically from the "./commands" directory.
  |
  */
  commands: [() => import('@adonisjs/core/commands'), () => import('@adonisjs/lucid/commands')],

  /*
  |--------------------------------------------------------------------------
  | Service providers
  |--------------------------------------------------------------------------
  |
  | List of service providers to import and register when booting the
  | application
  |
  */
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    () => import('@adonisjs/static/static_provider'),
    () => import('@adonisjs/vite/vite_provider'),
    {
      file: () => import('@adonisjs/core/providers/repl_provider'),
      environment: ['repl', 'test'],
    },
    () => import('@adonisjs/cors/cors_provider'),
    () => import('@adonisjs/core/providers/vinejs_provider'),
    () => import('@adonisjs/lucid/database_provider'),
    () => import('@adonisjs/core/providers/edge_provider'),
    () => import('@adonisjs/session/session_provider'),
    () => import('@adonisjs/shield/shield_provider'),
    () => import('@adonisjs/auth/auth_provider'),
    () => import('@adonisjs/i18n/i18n_provider'),
    () => import('@thisismissem/adonisjs-respond-with/provider'),
  ],

  /*
  |--------------------------------------------------------------------------
  | Preloads
  |--------------------------------------------------------------------------
  |
  | List of modules to import before starting the application.
  |
  */
  preloads: [
    () => import('#start/migrations'),
    () => import('#start/logging'),
    () => import('#start/routes'),
    () => import('#start/kernel'),
    () => import('#start/events'),
    () => import('#start/vine'),
    () => import('#start/view'),
  ],

  /*
  |--------------------------------------------------------------------------
  | Tests
  |--------------------------------------------------------------------------
  |
  | List of test suites to organize tests by their type. Feel free to remove
  | and add additional suites.
  |
  */
  tests: {
    suites: [
      {
        files: ['tests/unit/**/*.spec(.ts|.js)'],
        name: 'unit',
        timeout: 2000,
      },
      {
        files: ['tests/request/**/*.spec(.ts|.js)'],
        name: 'request',
        timeout: 30000,
      },
    ],
    forceExit: false,
  },

  metaFiles: [
    {
      pattern: 'public/**',
      reloadServer: false,
    },
    {
      pattern: 'resources/views/**/*.edge',
      reloadServer: false,
    },
    {
      pattern: 'resources/locales/**/*.{json,yaml,yml}',
      reloadServer: true,
    },
  ],

  hooks: {
    onBuildStarting: [() => import('@adonisjs/vite/build_hook')],
  },

  assetsBundler: false,
})
