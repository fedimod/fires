import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

const LabelsApiController = () => import('#controllers/api/labels_controller')

router
  .group(() => {
    router
      .resource('labels', LabelsApiController)
      .except(['create', 'edit'])
      .where('id', router.matchers.uuid())
      .as('labels')
  })
  .use([middleware.tokenAuth(), middleware.requireTokenAuth()])
  .use(throttle)
  .prefix('api')
  .as('api')
