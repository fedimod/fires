import type { HttpContext } from '@adonisjs/core/http'
import Label from '#models/label'
import { LabelsSerializer } from '#serializers/labels_serializer'

export default class LabelsController {
  async index({ response, view }: HttpContext) {
    const labels = await Label.all()
    return response.negotiate(
      {
        json() {
          response.json(LabelsSerializer.collection(labels))
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
        json() {
          response.json(LabelsSerializer.singular(label))
        },
        html() {
          return view.render('labels/show', { label })
        },
      },
      { defaultHandler: 'html' }
    )
  }
}
