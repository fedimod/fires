import Dataset from '#models/dataset'
import { ExportDatasetService } from '#services/export_dataset_service'
import { exportValidator } from '#validators/export'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ExportsController {
  constructor(protected exportService: ExportDatasetService) {}

  async perform({ request, response, logger, session }: HttpContext) {
    const { params } = await request.validateUsing(exportValidator)

    const dataset = await Dataset.findOrFail(params.dataset_id)
    const abortController = new AbortController()
    const timeoutSignal = AbortSignal.timeout(5000)
    const abortSignal = AbortSignal.any([abortController.signal, timeoutSignal])

    const exportResult = await this.exportService.createZip(dataset, { signal: abortSignal })
    if (!exportResult.success) {
      if (exportResult.empty) {
        session.flash('notification', {
          type: 'error',
          message: "This dataset doesn't contain any data yet!",
        })
        return response.redirect().back()
      }

      logger.error(exportResult.message, 'Error creating export')

      return response.status(500).json({
        error: 'Error creating export',
      })
    }

    response.safeHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`)
    response.download(exportResult.archivePath, true)
  }
}
