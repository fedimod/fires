import Setting from '#models/setting'
import type { HttpContext } from '@adonisjs/core/http'
import { ApiExcludeOperation } from '@foadonis/openapi/decorators'

export default class AboutController {
  @ApiExcludeOperation()
  async index({ view }: HttpContext) {
    const description = await Setting.find('description')
    return view.render('about/index', {
      description: description?.value ?? 'This FIRES server is not yet configured correctly.',
    })
  }
}
