import type { HttpContext } from '@adonisjs/core/http'
import Label from '#models/label'
import { LabelsSerializer } from '#serializers/labels_serializer'
import { inject } from '@adonisjs/core'

@inject()
export default class LabelsController {
  constructor(protected labelsSerializer: LabelsSerializer) {}

  async index({ response, view }: HttpContext) {
    return response.negotiate(
      {
        json: async (acceptedType) => {
          if (acceptedType?.startsWith('application/ld+json')) {
            response.header('Content-Type', 'application/ld+json; charset=utf-8')
          }

          const labels = await Label.query().preload('translations')

          response.json(await this.labelsSerializer.collection(labels), true)
        },
        html: async () => {
          const labels = await Label.query()
            .whereNull('deprecatedAt')
            .orderBy('id', 'desc')
            .withCount('translations')

          const deprecatedLabels = await Label.query()
            .whereNotNull('deprecatedAt')
            .orderBy('id', 'desc')
            .withCount('translations')

          return view.render('labels/index', {
            labels: labels.map((label) => {
              return {
                ...label.serialize(),
                translations_count: Number.parseInt(label.$extras.translations_count, 10),
              }
            }),
            deprecatedLabels: deprecatedLabels.map((label) => {
              return {
                ...label.serialize(),
                translations_count: Number.parseInt(label.$extras.translations_count, 10),
              }
            }),
          })
        },
      },
      { defaultHandler: 'html' }
    )
  }

  async show({ params, response, view }: HttpContext) {
    const label =
      typeof params.slug === 'string'
        ? await Label.findByOrFail('slug', params.slug)
        : await Label.findOrFail(params.id)

    return response.negotiate(
      {
        json: async (acceptedType) => {
          if (typeof params.slug === 'string') {
            return response.redirect().toRoute('protocol.labels.show', { id: label.id })
          }

          if (acceptedType?.startsWith('application/ld+json')) {
            response.header('Content-Type', 'application/ld+json; charset=utf-8')
          }

          await label.load('translations')

          response.json(await this.labelsSerializer.singular(label), true)
        },
        html() {
          if (typeof params.id === 'string') {
            return response.redirect().toRoute('labels.show', { slug: label.slug })
          }
          return view.render('labels/show', { label })
        },
      },
      { defaultHandler: params.id ? 'json' : 'html' }
    )
  }
}
