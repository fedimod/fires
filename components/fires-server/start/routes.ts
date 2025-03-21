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

// NodeInfo
const nodeinfoController = () => import('#controllers/well-known/node_info_controller')

router.get('/.well-known/nodeinfo', [nodeinfoController, 'discovery'])
router.get('/nodeinfo/2.1', [nodeinfoController, 'retrieval'])
router.resource('labels', () => import('#controllers/labels_controller')).only(['index', 'show'])

router
  .group(() => {
    router
      .resource('labels', () => import('#controllers/api/labels_controller'))
      .except(['create', 'edit'])
      .as('labels')
  })
  .prefix('api')
  .as('api')
