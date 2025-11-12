import Dataset from '#models/dataset'
import { ImportFileService } from '#services/import_file_service'
import { importFileValidator, importValidator } from '#validators/imports'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ImportsController {
  constructor(protected importFileService: ImportFileService) {}

  // Allows uploading a CSV file for a specific dataset to import:
  async index({ view }: HttpContext) {
    const datasets = await Dataset.query().select('id', 'name')

    return view.render('admin/imports/index', {
      datasets: datasets.map((dataset) => dataset.serialize()),
    })
  }

  // Receives the csv file and prepares it for an import,
  // renders a page allowing confirmation / adjustment of
  // the data to be imported
  async prepare({ request, response, session, view }: HttpContext) {
    const data = await request.validateUsing(importFileValidator)
    const dataset = await Dataset.findOrFail(data.dataset)

    if (!data.file.isValid || !data.file.tmpPath) {
      session.flash('notification', {
        type: 'error',
        message: 'Invalid file uploaded',
      })
      return response.redirect().back()
    }

    const results = await this.importFileService.process(dataset, data.file.tmpPath, {
      defaultType: data.defaultType,
    })

    if (!results.success) {
      session.flash('notification', {
        type: 'error',
        message: results.error,
      })
      return response.redirect().back()
    }

    // db?

    return view.render('admin/imports/review', {
      dataset: dataset.serialize(),
      created: results.new, //.map((change) => change.serialize()),
      changed: results.changed, //.map((change) => change.serialize()),
      unchanged: results.unchanged, //.map((change) => change.serialize()),
      missing: results.missing,
      defaultType: data.defaultType,
    })
  }

  // Handles the prepared import and creates the records
  // in the dataset:
  async perform({ response, request, session, logger }: HttpContext) {
    // We can't use request.validateUsing here, as the request is a form
    // submission from a form submission, which means request.back() doesn't
    // exist:
    const [error, data] = await importValidator.tryValidate(request.all())
    if (error) {
      logger.error(error, 'Failed validation for performing import')
      session.flash('notification', {
        type: 'error',
        message: `Failed to process import. An unexpected error occurred.`,
      })
      return response.redirect().toRoute('admin.imports.index')
    }

    const dataset = await Dataset.findOrFail(data.dataset_id)

    if (!data.changes) {
      session.flash('notification', {
        type: 'success',
        message: `No changes were imported into the dataset.`,
      })

      return response.redirect().toRoute('admin.datasets.show', { id: dataset.id })
    }

    const changes = await dataset
      .related('changes')
      .createMany(Array.from(Object.values(data.changes)))

    session.flash('notification', {
      type: 'success',
      message: `Imported ${changes.length} changes into the dataset!`,
    })

    return response.redirect().toRoute('admin.datasets.show', { id: dataset.id })
  }

  // This should never happen:
  async failedImport({ response }: HttpContext) {
    return response.redirect().toRoute('admin.imports.index')
  }
}
