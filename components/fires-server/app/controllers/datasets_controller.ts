import Dataset from '#models/dataset'
import { DatasetSerializer } from '#serializers/dataset_serializer'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DatasetsController {
  constructor(protected datasetSerializer: DatasetSerializer) {}

  async index({ view, response }: HttpContext) {
    const datasets = await Dataset.all()

    return response.negotiate({
      json: async () => {
        return response.json(await this.datasetSerializer.collection(datasets), true)
      },
      html: async () => {
        return view.render('datasets/index', {
          datasets: datasets.map((dataset) => dataset.serialize()),
        })
      },
    })
  }

  async show({ response, params, view }: HttpContext) {
    const dataset =
      typeof params.slug === 'string'
        ? await Dataset.findByOrFail('slug', params.slug)
        : await Dataset.findOrFail(params.id)

    return response.negotiate(
      {
        json: async () => {
          if (typeof params.slug === 'string') {
            return response.redirect().toRoute('protocol.datasets.show', { id: dataset.id })
          }

          return response.json(await this.datasetSerializer.singular(dataset), true)
        },
        html() {
          if (typeof params.id === 'string') {
            return response.redirect().toRoute('datasets.show', { slug: dataset.slug })
          }

          return view.render('datasets/show', {
            dataset: dataset.serialize(),
          })
        },
      },
      { defaultHandler: params.slug ? 'html' : 'json' }
    )
  }
}
