import type { HttpContext } from '@adonisjs/core/http'

import Label from '#models/label'
import { createLabelValidator, updateLabelValidator } from '#validators/label'
import { DateTime } from 'luxon'

export default class LabelsApiController {
  /**
   * Handle the index action
   */
  async index({ response, token }: HttpContext) {
    if (!token.hasAbility('read')) {
      return token.insufficientScope()
    }

    const labels = await Label.all()

    return response.json({
      items: labels.map((label) => label.serialize()),
    })
  }

  /**
   * Handle the create action
   */
  async store(ctx: HttpContext) {
    const { request, response, i18n, token } = ctx
    if (!token.hasAbility('admin')) {
      return token.insufficientScope()
    }

    const data = await request.validateUsing(createLabelValidator)
    const language = i18n.locale

    const label = await Label.create({
      ...data,
      language,
    })

    return response.json(label.serialize())
  }

  /**
   * Handle update action
   */
  async update(ctx: HttpContext) {
    const { request, response, i18n, token } = ctx
    if (!token.hasAbility('admin')) {
      return token.insufficientScope()
    }

    const { params, ...update } = await request.validateUsing(updateLabelValidator)
    const label = await Label.findOrFail(params.id)

    await label.merge({ ...update, language: i18n.locale }).save()

    return response.json(label.serialize())
  }

  /**
   * Handle the delete / deprecate action
   */
  async destroy(ctx: HttpContext) {
    const { request, response, params, token } = ctx
    if (!token.hasAbility('admin')) {
      return token.insufficientScope()
    }

    const label = await Label.findOrFail(params.id)

    if (request.input('force') === 'true') {
      await label.delete()
      return response.noContent()
    }

    await label.merge({ deprecatedAt: DateTime.now() }).save()

    return response.json(label.serialize())
  }
}
