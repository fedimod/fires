import Label from '#models/label'
import LabelTranslation from '#models/label_translation'
import { createLabelValidator, updateLabelValidator } from '#validators/label'
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
    await label.load('translations')
    return view.render('admin/labels/create', {
      label: label.serialize(),
      newTranslation: new LabelTranslation(),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createLabelValidator)
    const label = await Label.create(data)

    session.flash('notification', {
      type: 'success',
      message: 'Label successfully created!',
    })

    response.redirect().toRoute('admin.labels.show', { id: label.id })
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const label = await Label.findOrFail(params.id)

    return view.render('admin/labels/show', {
      label: label.serialize(),
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
  async update({ request, response, session, logger }: HttpContext) {
    logger.info(request.all())
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
