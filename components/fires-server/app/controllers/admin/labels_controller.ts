import Label from '#models/label'
import LabelTranslation from '#models/label_translation'
import { defaultLocale } from '#utils/locale'
import { createLabelValidator, showLabelValidator, updateLabelValidator } from '#validators/label'
import type { HttpContext } from '@adonisjs/core/http'

export default class LabelsController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const labels = await Label.all()

    return view.render('admin/labels/index', {
      labels: labels.map((label) => label.serialize()),
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const label = new Label()

    return view.render('admin/labels/create', {
      label: label.serialize(),
      newTranslation: new LabelTranslation(),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    const { translations, ...labelData } = await request.validateUsing(createLabelValidator)
    const label = await Label.create(labelData)

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

    session.flash('notification', {
      type: 'success',
      message: 'Label successfully created!',
    })

    response.redirect().toRoute('admin.labels.show', { id: label.id })
  }

  /**
   * Show individual record
   */
  async show({ request, response, params, session, view }: HttpContext) {
    const [error, validated] = await showLabelValidator.tryValidate({
      params: params,
      ...request.all(),
    })
    const id = error === null ? validated.params.id : params.id

    const label = await Label.findOrFail(id)
    await label.load('translations', (query) => {
      query.select('locale')
    })

    // The typings in Vine.js have error.messages as any instead of the records they actually are.
    if (
      error?.messages.some(
        (err: { rule: string; field: string }) => err.rule === 'locale' && err.field === 'locale'
      )
    ) {
      session.flash('notification', {
        type: 'info',
        message: `The requested locale is not valid, showing the default locale`,
      })

      return response.redirect().toRoute('admin.labels.show', { id: label.id })
    }
    let localized = null
    if (validated?.locale && validated.locale !== label.locale) {
      localized = await LabelTranslation.findBy({
        locale: validated.locale,
        label_id: label.id,
      })

      if (localized === null) {
        session.flash('notification', {
          type: 'info',
          message: `The requested locale does not exist, showing the default locale`,
        })

        return response.redirect().toRoute('admin.labels.show', { id: label.id })
      }
    }

    return view.render('admin/labels/show', {
      label: label.serialize(),
      localized: localized ? localized.serialize() : null,
      locale: validated?.locale ?? label.locale ?? defaultLocale,
    })
  }

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const label = await Label.findOrFail(params.id)
    await label.load('translations')

    return view.render('admin/labels/edit', {
      label: label.serialize(),
      newTranslation: new LabelTranslation(),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, session }: HttpContext) {
    const { params, translations, ...update } = await request.validateUsing(updateLabelValidator)
    const label = await Label.findOrFail(params.id)

    await label.merge(update).save()

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

    session.flash('notification', {
      type: 'success',
      message: 'Label successfully updated!',
    })

    response.redirect().toRoute('admin.labels.show', { id: label.id })
  }

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
