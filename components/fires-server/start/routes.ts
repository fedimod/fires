/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AboutController = () => import('#controllers/about_controller')
const NodeinfoController = () => import('#controllers/well-known/nodeinfo_controller')
const LabelsController = () => import('#controllers/labels_controller')
const LabelsApiController = () => import('#controllers/api/labels_controller')

router.get('/', [AboutController, 'index']).as('about')
router.get('/health', ({ response }) => {
  return response.safeStatus(200).json({ ok: true })
})

// NodeInfo
router.get('/.well-known/nodeinfo', [NodeinfoController, 'discovery']).as('nodeinfo.discovery')
router.get('/nodeinfo/2.1', [NodeinfoController, 'retrieval']).as('nodeinfo.retrieval')

// FIRES labels Endpoint
router.resource('labels', LabelsController).only(['index', 'show'])

// Reference Server Management API:
router
  .group(() => {
    router.resource('labels', LabelsApiController).except(['create', 'edit']).as('labels')
  })
  .use([middleware.auth(), middleware.requireAuth()])
  .prefix('api')
  .as('api')
