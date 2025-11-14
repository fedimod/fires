import Dataset from '#models/dataset'
import { ExportDatasetService } from '#services/export_dataset_service'
import { exportValidator } from '#validators/export'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { unlink } from 'node:fs/promises'

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
      } else {
        logger.error(exportResult.message, 'Error creating export')
        session.flash('notification', {
          type: 'error',
          message: "We're having some troubles creating an export at this time.",
        })
      }

      return response.redirect().back()
    }

    response.safeHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`)
    response.download(exportResult.archivePath, true)

    response.onFinish((err) => {
      if (err) {
        logger.error(err, 'Error sending response')
      }

      unlink(exportResult.archivePath)
        .then(() => {
          logger.debug({ file: exportResult.archivePath }, 'Unlinked dataset export file')
        })
        .catch((error) => {
          logger.error({ error, file: exportResult.archivePath }, 'Error unlinking dataset export')
        })
    })
  }
}
