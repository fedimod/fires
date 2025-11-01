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

  async snapshot({ request }: HttpContext) {
    const { params } = await request.validateUsing(snapshotRequestValidator)

    return await cache.getOrSetForever({
      key: `dataset::snapshot::${params.dataset_id}`,
      factory: async () => {
        const dataset = await Dataset.findOrFail(params.dataset_id)
        const snapshot = await this.snapshotService.getSnapshot(params.dataset_id)
        return this.snapshotSerializer.collection(snapshot, dataset)
      },
    })
  }
}
