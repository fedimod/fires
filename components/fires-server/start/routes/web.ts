import { throttle, throttleExports } from '#start/limiter'
import router from '@adonisjs/core/services/router'

const AboutController = () => import('#controllers/about_controller')
const LabelsController = () => import('#controllers/labels_controller')
const DatasetsController = () => import('#controllers/datasets_controller')
const DatasetExportsController = () => import('#controllers/datasets/exports_controller')

router
  .group(() => {
    router.get('/', [AboutController, 'index']).as('about')

    router
      .get('/labels/:slug', [LabelsController, 'show'])
      .where('slug', router.matchers.slug())
      .as('labels.show')

    router.get('/labels', [LabelsController, 'index']).as('labels.index')
    router.resource('datasets', DatasetsController).only(['index', 'show']).params({
      datasets: 'slug',
    })

    router
      .post('/datasets/:dataset_id/export', [DatasetExportsController, 'perform'])
      .where('dataset_id', router.matchers.uuid())
      .use(throttleExports)
      .as('datasets.export')
  })
  .use(throttle)
