import Dataset from '#models/dataset'
import { SnapshotSerializer } from '#serializers/snapshot_serializer'
import SnapshotService from '#services/snapshot_service'
import { snapshotRequestValidator } from '#validators/snapshot'
import cache from '@adonisjs/cache/services/main'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SnapshotsController {
  constructor(
    protected snapshotSerializer: SnapshotSerializer,
    protected snapshotService: SnapshotService
  ) {}

  async snapshot({ request, response }: HttpContext) {
    const { params } = await request.validateUsing(snapshotRequestValidator)

    if (request.header('Accept')?.startsWith('application/ld+json')) {
      response.header('Content-Type', 'application/ld+json; charset=utf-8')
    } else {
      response.header('Content-Type', 'application/json; charset=utf-8')
    }

    response.json(
      await cache.getOrSetForever({
        key: `dataset::snapshot::${params.dataset_id}`,
        factory: async () => {
          const dataset = await Dataset.findOrFail(params.dataset_id)
          const snapshot = await this.snapshotService.getSnapshot(params.dataset_id)
          return this.snapshotSerializer.collection(snapshot, dataset)
        },
      }),
      true
    )
  }
}
