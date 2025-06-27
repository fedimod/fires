import router from '@adonisjs/core/services/router'

const AboutController = () => import('#controllers/about_controller')
const LabelsController = () => import('#controllers/labels_controller')

router.get('/', [AboutController, 'index']).as('about')
router
  .get('/labels/:slug', [LabelsController, 'show'])
  .where('slug', router.matchers.slug())
  .as('labels.show')

router.get('/labels', [LabelsController, 'index']).as('labels.index')
