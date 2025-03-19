/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', [() => import('#controllers/about_controller'), 'index'])

router.resource('labels', () => import('#controllers/labels_controller')).only(['index', 'show'])

router
  .group(() => {
    router
      .resource('labels', () => import('#controllers/labels_controller'))
      .except(['index', 'create', 'edit'])
      .as('labels')
  })
  .prefix('api')
  .as('api')
