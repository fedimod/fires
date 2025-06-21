import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AdminSessionsController = () => import('#controllers/admin/sessions_controller')
const AdminOverviewController = () => import('#controllers/admin/overview_controller')
const AdminLabelsController = () => import('#controllers/admin/labels_controller')
const AdminSettingsController = () => import('#controllers/admin/settings_controller')

router.get('/admin', ({ response }) => response.redirect().toRoute('admin.overview'))
router
  .group(() => {
    router.post('logout', [AdminSessionsController, 'logout']).as('logout')
    router.get('overview', [AdminOverviewController, 'index']).as('overview')
    router
      .resource('labels', AdminLabelsController)
      .where('id', router.matchers.uuid())
      .except(['destroy'])
      .as('labels')

    router.get('settings', [AdminSettingsController, 'show']).as('settings')
    router.post('settings', [AdminSettingsController, 'update']).as('settings.update')
  })
  .use(middleware.adminAuth())
  .prefix('admin')
  .as('admin')

router
  .group(() => {
    router.get('/admin/login', [AdminSessionsController, 'login']).as('admin.login')
    router.post('/admin/login', [AdminSessionsController, 'performLogin']).as('admin.performLogin')
  })
  .use(middleware.guest())
