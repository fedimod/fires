import type { HttpContext } from '@adonisjs/core/http'
import Label from '#models/label'
import { CONTEXT, LabelsSerializer } from '#serializers/labels_serializer'
import router from '@adonisjs/core/services/router'
import env from '#start/env'

export default class LabelsController {
  async index({ response, view }: HttpContext) {
    const labels = await Label.all()
    return response.negotiate(
      {
        async json(acceptedType) {
          if (acceptedType?.startsWith('application/ld+json')) {
            response.header('Content-Type', 'application/ld+json; charset=utf-8')
          }

          response.json(await LabelsSerializer.collection(labels))
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

    return response.negotiate(
      {
        json(acceptedType) {
          if (acceptedType?.startsWith('application/ld+json')) {
            response.header('Content-Type', 'application/ld+json; charset=utf-8')
          }

          const collectionId = new URL(router.makeUrl('labels.index'), env.get('PUBLIC_URL')).href

          response.json({
            '@context': CONTEXT,
            ...LabelsSerializer.singular(label, collectionId),
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
