import type { HttpContext } from '@adonisjs/core/http'
import Label from '#models/label'
import { CONTEXT, LabelsSerializer } from '#serializers/labels_serializer'
import { inject } from '@adonisjs/core'

@inject()
export default class LabelsController {
  constructor(protected labelsSerializer: LabelsSerializer) {}

  async index({ response, view }: HttpContext) {
    const labels = await Label.all()
    return response.negotiate(
      {
        json: async (acceptedType) => {
          if (acceptedType?.startsWith('application/ld+json')) {
            response.header('Content-Type', 'application/ld+json; charset=utf-8')
          }

          response.json(await this.labelsSerializer.collection(labels))
        },
        html() {
          return view.render('labels/index', { labels })
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
        json: (acceptedType) => {
          if (typeof params.slug === 'string') {
            return response.redirect().toRoute('protocol.labels.show', { id: label.id })
          }

          if (acceptedType?.startsWith('application/ld+json')) {
            response.header('Content-Type', 'application/ld+json; charset=utf-8')
          }

          response.json({
            '@context': CONTEXT,
            ...this.labelsSerializer.singular(label),
          })
        },
        html() {
          if (typeof params.id === 'string') {
            return response.redirect().toRoute('labels.show', { slug: label.slug })
          }
          return view.render('labels/show', { label })
        },
      },
      { defaultHandler: 'html' }
    )
  }
}
