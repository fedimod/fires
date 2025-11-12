import Dataset from '#models/dataset'
import DatasetChange from '#models/dataset_change'
import Label from '#models/label'
import { arraysEqual } from '#utils/comparison'
import {
  createDatasetChangeValidator,
  listDatasetChangesValidator,
  newDatasetChangeValidator,
} from '#validators/dataset_change'
import cache from '@adonisjs/cache/services/main'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DatasetChangesController {
  /**
   * Display a list of resource
   */
  async index({ view, request }: HttpContext) {
    const { params, page } = await request.validateUsing(listDatasetChangesValidator)
    const dataset = await Dataset.findOrFail(params.dataset_id)
    const changes = await DatasetChange.query()
      .where('datasetId', dataset.id)
      .orderBy('id', 'desc')
      .paginate(page ?? 1, 100)

    changes.baseUrl(request.url())

    const labels = await Label.findUniqueByIds(changes.flatMap((record) => record.labels))

    return view.render('admin/datasets/changes/index', {
      dataset: dataset.serialize(),
      changes: changes.all().map((change) => change.serialize()),
      nextUrl: changes.getNextPageUrl(),
      prevUrl: changes.getPreviousPageUrl(),
      labels: labels,
      total: changes.total,
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ view, request }: HttpContext) {
    const { params, change_id: changeId } = await request.validateUsing(newDatasetChangeValidator)
    const dataset = await Dataset.findOrFail(params.dataset_id)
    const labels = await Label.query().orderBy('deprecatedAt', 'desc').orderBy('id', 'desc')

    const baseChange = changeId ? await DatasetChange.find(changeId) : null

    return view.render('admin/datasets/changes/create', {
      dataset: dataset.serialize(),
      baseChange: changeId ? baseChange?.serialize() : null,
      labels: labels.map((label) => label.serialize()),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, view }: HttpContext) {
    const { params, ...data } = await request.validateUsing(createDatasetChangeValidator)
    const dataset = await Dataset.findOrFail(params.dataset_id)

    const latestForEntity = await DatasetChange.latestForEntity(
      params.dataset_id,
      data.entity_kind,
      data.entity_key
    )

    // Check that we're actually making a change:
    if (latestForEntity) {
      if (
        latestForEntity.type === data.type &&
        latestForEntity.recommendedPolicy === data.recommended_policy &&
        arraysEqual(latestForEntity.labels, data.labels ?? [])
      ) {
        const merged = latestForEntity.merge(data).serialize()
        const labels = await Label.query().orderBy('deprecatedAt', 'desc').orderBy('id', 'desc')

        return view.render('admin/datasets/changes/create', {
          dataset: dataset.serialize(),
          baseChange: merged,
          labels: labels.map((label) => label.serialize()),
          notification: {
            type: 'error',
            message: 'No changes detected to record',
          },
        })
      }
    }

    await DatasetChange.create({
      ...data,
      labels: data.labels ?? [],
      datasetId: params.dataset_id,
    })

    await cache.deleteMany({
      keys: [`dataset::snapshot::${dataset.id}`, `dataset::latest::${dataset.id}`],
    })

    return response.redirect().toRoute('admin.datasets.show', { id: params.dataset_id })
  }
}
