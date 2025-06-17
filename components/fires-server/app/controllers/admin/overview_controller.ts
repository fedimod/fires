import type { HttpContext } from '@adonisjs/core/http'

export default class OverviewController {
  async index({ view }: HttpContext) {
    return view.render('admin/overview')
  }
}
