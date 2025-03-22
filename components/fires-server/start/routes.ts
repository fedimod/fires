/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'

router.get('/', [() => import('#controllers/about_controller'), 'index']).as('about')
router.get('/health', ({ response }) => {
  return response.send('ok')
})

// NodeInfo
const nodeinfoController = () => import('#controllers/well-known/nodeinfo_controller')

router.get('/.well-known/nodeinfo', [nodeinfoController, 'discovery']).as('nodeinfo.discovery')
router.get('/nodeinfo/2.1', [nodeinfoController, 'retrieval']).as('nodeinfo.retrieval')

// FIRES labels Endpoint
router.resource('labels', () => import('#controllers/labels_controller')).only(['index', 'show'])

// Reference Server Management API:
router
  .group(() => {
    router
      .resource('labels', () => import('#controllers/api/labels_controller'))
      .except(['create', 'edit'])
      .as('labels')

    openapi.registerRoutes('/', (route) => route.as('openapi'))
  })
  .prefix('api')
  .as('api')
