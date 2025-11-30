import Dataset from '#models/dataset'
import Label from '#models/label'
import SnapshotService from '#services/snapshot_service'
import { defaultLocale } from '#utils/locale'
import { createDatasetValidator, updateDatasetValidator } from '#validators/admin/dataset'
import cache from '@adonisjs/cache/services/main'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DatasetsController {
  constructor(protected snapshotService: SnapshotService) {}

  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const datasets = await Dataset.all()

    return view.render('admin/datasets/index', {
      datasets: datasets.map((dataset) => dataset.serialize()),
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ bouncer, view }: HttpContext) {
    await bouncer.with('DatasetsPolicy').authorize('manage')

    const dataset = new Dataset()
    return view.render('admin/datasets/create', {
      dataset: dataset.serialize(),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, bouncer, session }: HttpContext) {
    await bouncer.with('DatasetsPolicy').authorize('manage')

    const create = await request.validateUsing(createDatasetValidator)
    const dataset = await Dataset.create({ ...create, locale: create.locale ?? defaultLocale })

    await cache.deleteByTag({ tags: ['datasets'] })
    await cache.delete({ key: 'configuration' })

    session.flash('notification', {
      type: 'success',
      message: 'Dataset successfully created!',
    })

    response.redirect().toRoute('admin.datasets.show', { id: dataset.id })
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const dataset = await Dataset.findOrFail(params.id)
    const snapshot = await this.snapshotService.getSnapshot(dataset.id)

    const labels = await Label.findUniqueByIds(snapshot.records.flatMap((record) => record.labels))

    return view.render('admin/datasets/show', {
      dataset: dataset.serialize(),
      labels,
      snapshot: snapshot.records.map((change) => change.serialize()),
      hasMore: snapshot.hasMore,
      totalChanges: snapshot.totalChanges,
    })
  }

  /**
   * Edit individual record
   */
  async edit({ params, bouncer, view }: HttpContext) {
    await bouncer.with('DatasetsPolicy').authorize('manage')

    const dataset = await Dataset.findOrFail(params.id)

    return view.render('admin/datasets/edit', {
      dataset: dataset.serialize(),
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, bouncer, session }: HttpContext) {
    await bouncer.with('DatasetsPolicy').authorize('manage')

    const { params, ...update } = await request.validateUsing(updateDatasetValidator)
    const dataset = await Dataset.findOrFail(params.id)

    await dataset.merge({ ...update, locale: update.locale ?? defaultLocale }).save()

    await cache.deleteByTag({ tags: ['datasets'] })
    await cache.delete({ key: 'configuration' })

    session.flash('notification', {
      type: 'success',
      message: 'Dataset successfully updated!',
    })

    response.redirect().toRoute('admin.datasets.show', { id: dataset.id })
  }

  /**
   * Delete record
   */
  async destroy({ request, response, params, bouncer, session, view }: HttpContext) {
    await bouncer.with('DatasetsPolicy').authorize('manage')

    const dataset = await Dataset.findOrFail(params.id)

    if (request.method() !== 'DELETE') {
      return view.render('admin/datasets/destroy', {
        dataset: dataset.serialize(),
      })
    }

    await dataset.delete()

    await cache.deleteMany({
      keys: [`dataset::snapshot::${dataset.id}`, `dataset::latest::${dataset.id}`],
    })

    await cache.deleteByTag({ tags: ['datasets'] })
    await cache.delete({ key: 'configuration' })

    session.flash('notification', {
      type: 'success',
      message: 'Dataset successfully deleted!',
    })

    response.redirect().toRoute('admin.datasets.index')
  }
}
