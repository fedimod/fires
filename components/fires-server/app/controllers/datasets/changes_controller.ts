import Dataset from '#models/dataset'
import DatasetChange from '#models/dataset_change'
import { ChangeSerializer } from '#serializers/change_serializer'
import { JSON_LD_CONTEXT } from '#utils/jsonld'
import { datasetChangesRequestValidator } from '#validators/dataset_changes'
import cache from '@adonisjs/cache/services/main'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ChangesController {
  constructor(protected changeSerializer: ChangeSerializer) {}

  async list({ request, response }: HttpContext) {
    const [error, data] = await datasetChangesRequestValidator.tryValidate({
      params: request.params(),
      ...request.all(),
    })

    if (error) {
      return response.status(400).json({
        error: 'Malformed request',
        validation: error.messages,
      })
    }

    const { params, since } = data
    const dataset = await Dataset.findOrFail(params.dataset_id)

    const { lastChange, totalItems } = await cache.getOrSetForever({
      key: `dataset::latest::${dataset.id}`,
      factory: async () => {
        return {
          lastChange: await DatasetChange.query()
            .where('dataset_id', dataset.id)
            .orderBy('id', 'desc')
            .first(),

          totalItems: await Dataset.countChanges(dataset.id),
        }
      },
    })

    const limit = 100
    const fetch = limit + 1
    const changes = since
      ? await DatasetChange.query()
          .where('dataset_id', dataset.id)
          .if(since, (query) => {
            query.where('id', '>', since!)
          })
          .orderBy('id', 'asc')
          .limit(fetch)
      : []

    // The record at the limit is the last record of limit + 1, since arrays are zero-indexed
    const nextChange = since ? (changes.at(limit) ?? null) : null

    return await this.changeSerializer.collection(dataset, {
      since: since,
      page: !!since,
      last: lastChange,
      next: nextChange,
      total: totalItems,
      records: since ? (since === lastChange?.id ? [] : changes.slice(0, limit)) : undefined,
    })
  }

  async show({ params }: HttpContext) {
    const dataset = await Dataset.findOrFail(params.dataset_id)
    const change = await DatasetChange.findByOrFail({ id: params.id, dataset_id: dataset.id })

    return {
      '@context': JSON_LD_CONTEXT,
      ...(await this.changeSerializer.item(change)),
    }
  }
}
