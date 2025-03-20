import type { HttpContext } from '@adonisjs/core/http'

import Label from '#models/label'
import { createLabelValidator, updateLabelValidator } from '#validators/label'
import { DateTime } from 'luxon'

export default class LabelsApiController {
  /**
   * Handle form submission for the create action
   */
  async store({ request, response, i18n }: HttpContext) {
    const data = await request.validateUsing(createLabelValidator)
    const language = i18n.locale

    const label = await Label.create({
      ...data,
      language,
    })

    return response.json(label.serialize())
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, i18n }: HttpContext) {
    const { params, ...update } = await request.validateUsing(updateLabelValidator)
    const label = await Label.findOrFail(params.id)

    await label.merge({ ...update, language: i18n.locale }).save()

    return response.json(label.serialize())
  }

  /**
   * Delete record
   */
  async destroy({ params, request, response }: HttpContext) {
    const label = await Label.findOrFail(params.id)

    if (request.input('force') === 'true') {
      await label.delete()
      return response.noContent()
    }

    await label.merge({ deprecatedAt: DateTime.now() }).save()

    return response.json(label.serialize())
  }
}
