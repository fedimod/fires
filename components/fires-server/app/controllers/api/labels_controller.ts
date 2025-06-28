import type { HttpContext } from '@adonisjs/core/http'

import Label from '#models/label'
import { createLabelValidator, updateLabelValidator } from '#validators/label'
import { DateTime } from 'luxon'
import { defaultLocale } from '#utils/locale'
import LabelTranslation from '#models/label_translation'
import cache from '@adonisjs/cache/services/main'

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
    const { request, response, token } = ctx
    if (!token.hasAbility('admin')) {
      return token.insufficientScope()
    }

    const { translations, ...data } = await request.validateUsing(createLabelValidator)
    const label = await Label.create({
      ...data,
      locale: data.locale ?? defaultLocale,
    })

    const presentTranslations = translations.filter(
      (translation) => translation.name || translation.summary || translation.description
    )

    if (presentTranslations.length > 0) {
      // Update or create other translations
      await LabelTranslation.updateOrCreateMany(
        'locale',
        presentTranslations.map((translation) => {
          return { ...translation, labelId: label.id }
        })
      )
    }

    await cache.deleteByTag({ tags: ['labels'] })

    return response.json(label.serialize())
  }

  /**
   * Handle update action
   */
  async update(ctx: HttpContext) {
    const { request, response, token } = ctx
    if (!token.hasAbility('admin')) {
      return token.insufficientScope()
    }

    const { params, translations, ...update } = await request.validateUsing(updateLabelValidator)
    const label = await Label.findOrFail(params.id)

    await label.merge({ ...update, locale: update.locale ?? defaultLocale }).save()

    const presentTranslations = translations.filter(
      (translation) => translation.name || translation.summary || translation.description
    )

    // Remove translations that no longer exist:
    await LabelTranslation.query()
      .whereNotIn(
        'locale',
        presentTranslations.map((translation) => translation.locale)
      )
      .delete()

    if (translations.length > 0) {
      // Update or create other translations
      await LabelTranslation.updateOrCreateMany(
        'locale',
        presentTranslations.map((translation) => {
          return { ...translation, labelId: label.id }
        })
      )
    }

    await cache.deleteByTag({ tags: ['labels'] })

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
      await cache.deleteByTag({ tags: ['labels'] })

      return response.noContent()
    }

    await label.merge({ deprecatedAt: DateTime.now() }).save()
    await cache.deleteByTag({ tags: ['labels'] })

    return response.json(label.serialize())
  }
}
