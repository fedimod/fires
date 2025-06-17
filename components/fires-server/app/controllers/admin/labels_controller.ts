import Label from '#models/label'
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
    return view.render('admin/labels/create', {
      label: label.serialize(),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session, i18n }: HttpContext) {
    const data = await request.validateUsing(createLabelValidator)
    const language = i18n.locale

    const label = await Label.create({
      ...data,
      language,
    })

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

    return view.render('admin/labels/edit', {
      label: label.serialize(),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, session, i18n }: HttpContext) {
    const { params, ...update } = await request.validateUsing(updateLabelValidator)
    const label = await Label.findOrFail(params.id)

    await label.merge({ ...update, language: i18n.locale }).save()

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
