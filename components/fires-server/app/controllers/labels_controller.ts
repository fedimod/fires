import type { HttpContext } from '@adonisjs/core/http'
import Label from '#models/label'
import { CONTEXT, LabelsSerializer } from '#serializers/labels_serializer'
import { UrlService } from '#services/url_service'
import { inject } from '@adonisjs/core'

@inject()
export default class LabelsController {
  constructor(
    protected urlService: UrlService,
    protected labelsSerializer: LabelsSerializer
  ) {}

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
    const label = await Label.findOrFail(params.id)
    const collectionId = this.urlService.makeUrl('labels.index')

    return response.negotiate(
      {
        json: (acceptedType) => {
          if (acceptedType?.startsWith('application/ld+json')) {
            response.header('Content-Type', 'application/ld+json; charset=utf-8')
          }

          response.json({
            '@context': CONTEXT,
            ...this.labelsSerializer.singular(label, collectionId),
          })
        },
        html() {
          return view.render('labels/show', { label })
        },
      },
      { defaultHandler: 'html' }
    )
  }
}
