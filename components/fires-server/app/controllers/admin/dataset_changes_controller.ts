import type { HttpContext, Request } from '@adonisjs/core/http'
import cache from '@adonisjs/cache/services/main'
import { inject } from '@adonisjs/core'
import { Infer } from '@vinejs/vine/types'

import Dataset from '#models/dataset'
import DatasetChange from '#models/dataset_change'
import Label from '#models/label'
import { arraysEqual } from '#utils/comparison'
import {
  createDatasetChangeValidator,
  listDatasetChangesValidator,
  reviseDatasetChangeValidator,
  newDatasetChangeValidator,
} from '#validators/dataset_change'

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
    const { params, ...data } = await request.validateUsing(createDatasetChangeValidator)
    const dataset = await Dataset.findOrFail(params.dataset_id)
    const labels = await Label.query().orderBy('deprecatedAt', 'desc').orderBy('id', 'desc')

    const baseChange = data.change_id ? await DatasetChange.find(data.change_id) : null

    return view.render('admin/datasets/changes/create', {
      dataset: dataset.serialize(),
      baseChange: baseChange?.serialize(),
      labels: labels.map((label) => label.serialize()),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, view }: HttpContext) {
    const { params, isChange, original, entity, ...data } = await this.getProperties(request)
    const dataset = await Dataset.findOrFail(params.dataset_id)

    const latestForEntity = await DatasetChange.latestForEntity(
      params.dataset_id,
      entity.kind,
      entity.key
    )

    // Check that we're actually making a change:
    if (latestForEntity) {
      if (
        latestForEntity.type === data.type &&
        latestForEntity.recommendedPolicy === data.recommended_policy &&
        arraysEqual(latestForEntity.labels, data.labels ?? [])
      ) {
        const merged = latestForEntity
          .merge(data)
          .merge({ entityKey: entity.key, entityKind: entity.kind })
          .serialize()

        const labels = await Label.query().orderBy('deprecatedAt', 'desc').orderBy('id', 'desc')

        return view.render('admin/datasets/changes/create', {
          dataset: dataset.serialize(),
          original,
          updated: merged,
          baseChange: isChange ? original : null,
          labels: labels.map((label) => label.serialize()),
          notification: {
            type: 'warning',
            message: isChange
              ? `No changes detected in this revision to ${merged.type}`
              : `The dataset already contains this ${merged.type}`,
          },
        })
      }
    }

    await DatasetChange.create({
      ...data,
      entityKey: entity.key,
      entityKind: entity.kind,
      labels: data.labels ?? [],
      datasetId: params.dataset_id,
    })

    await cache.deleteMany({
      keys: [`dataset::snapshot::${dataset.id}`, `dataset::latest::${dataset.id}`],
    })

    return response.redirect().toRoute('admin.datasets.show', { id: params.dataset_id })
  }

  private async getProperties(
    request: Request
  ): Promise<
    Infer<typeof newDatasetChangeValidator> & { isChange: boolean; original?: DatasetChange }
  > {
    if (request.input('change_id', null) !== null) {
      const { change_id: changeId, ...data } = await request.validateUsing(
        reviseDatasetChangeValidator
      )
      const baseChange = await DatasetChange.findOrFail(changeId)

      return {
        ...data,
        isChange: true,
        original: baseChange,
        entity: {
          key: baseChange.entityKey,
          kind: baseChange.entityKind,
        },
      }
    } else {
      const data = await request.validateUsing(newDatasetChangeValidator)
      return {
        ...data,
        isChange: false,
      }
    }
  }
}
