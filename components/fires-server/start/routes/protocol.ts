import router from '@adonisjs/core/services/router'

const NodeinfoController = () => import('#controllers/well-known/nodeinfo_controller')
const LabelsController = () => import('#controllers/labels_controller')

// NodeInfo
router.get('/.well-known/nodeinfo', [NodeinfoController, 'discovery']).as('nodeinfo.discovery')
router.get('/nodeinfo/2.1', [NodeinfoController, 'retrieval']).as('nodeinfo.retrieval')

// GET /labels in the protocol is handled by the web routes via content-negotiation
router
  .get('/labels/:id', [LabelsController, 'show'])
  .where('id', router.matchers.uuid())
  .as('protocol.labels.show')
