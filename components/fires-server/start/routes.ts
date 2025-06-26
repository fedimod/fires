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

const AdminSessionsController = () => import('#controllers/admin/sessions_controller')
const AdminOverviewController = () => import('#controllers/admin/overview_controller')
const AdminLabelsController = () => import('#controllers/admin/labels_controller')
const AdminSettingsController = () => import('#controllers/admin/settings_controller')

router.get('/', [AboutController, 'index']).as('about')
router.get('/health', ({ response }) => {
  return response.safeStatus(200).json({ ok: true })
})

// NodeInfo
router.get('/.well-known/nodeinfo', [NodeinfoController, 'discovery']).as('nodeinfo.discovery')
router.get('/nodeinfo/2.1', [NodeinfoController, 'retrieval']).as('nodeinfo.retrieval')

// FIRES labels Endpoint
router
  .get('labels/:id', [LabelsController, 'show'])
  .where('id', router.matchers.uuid())
  .as('protocol.labels.show')

router
  .get('labels/:slug', [LabelsController, 'show'])
  .where('slug', router.matchers.slug())
  .as('labels.show')

router.get('labels', [LabelsController, 'index']).as('labels.index')

// Reference Server Management API:
router
  .group(() => {
    router.resource('labels', LabelsApiController).except(['create', 'edit']).as('labels')
  })
  .use([middleware.tokenAuth(), middleware.requireTokenAuth()])
  .prefix('api')
  .as('api')

// Admin panel:
router.get('/admin', ({ response }) => response.redirect().toRoute('admin.overview'))
router
  .group(() => {
    router.post('logout', [AdminSessionsController, 'logout']).as('logout')
    router.get('overview', [AdminOverviewController, 'index']).as('overview')
    router
      .resource('labels', AdminLabelsController)
      .as('labels')
      .where('id', router.matchers.uuid())

    router.get('settings', [AdminSettingsController, 'show']).as('settings')
    router.post('settings', [AdminSettingsController, 'update']).as('settings.update')
  })
  .use(middleware.adminAuth())
  .prefix('admin')
  .as('admin')

router.post('/admin/login', [AdminSessionsController, 'performLogin']).as('admin.performLogin')

router
  .group(() => {
    router.get('/admin/login', [AdminSessionsController, 'login']).as('admin.login')
  })
  .use(middleware.guest())
