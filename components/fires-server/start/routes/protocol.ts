import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const NodeinfoController = () => import('#controllers/well-known/nodeinfo_controller')
const LabelsController = () => import('#controllers/labels_controller')
const DatasetsController = () => import('#controllers/datasets_controller')
const DatasetChangesController = () => import('#controllers/datasets/changes_controller')
const DatasetSnapshotsController = () => import('#controllers/datasets/snapshots_controller')

// NodeInfo
router.get('/.well-known/nodeinfo', [NodeinfoController, 'discovery']).as('nodeinfo.discovery')
router.get('/nodeinfo/2.1', [NodeinfoController, 'retrieval']).as('nodeinfo.retrieval')

router
  .group(() => {
    // GET /labels in the protocol is handled by the web routes via content-negotiation
    router.get('/labels/:id', [LabelsController, 'show']).as('labels.show')

    router
      .group(() => {
        router.get('/:id', [DatasetsController, 'show']).as('show')
        router.get('/:dataset_id/changes', [DatasetChangesController, 'list']).as('changes')
        router.get('/:dataset_id/changes/:id', [DatasetChangesController, 'show']).as('change')
        router.get('/:dataset_id/snapshot', [DatasetSnapshotsController, 'snapshot']).as('snapshot')
      })
      .prefix('/datasets')
      .as('datasets')
  })
  .where('dataset_id', router.matchers.uuid())
  .where('id', router.matchers.uuid())
  .as('protocol')
