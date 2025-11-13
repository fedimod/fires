import Dataset from '#models/dataset'
import { JSON_LD_CONTEXT, ObjectType, XSDDateFormat } from '#utils/jsonld'
import { UrlService } from '#services/url_service'
import markdown from '#utils/markdown'

type SingularOptions = {
  context: boolean
}

export class DatasetSerializer {
  async collection(datasets: Dataset[]) {
    return {
      '@context': JSON_LD_CONTEXT,
      'type': 'Collection',
      'totalItems': datasets.length,
      'items': await Promise.all(
        datasets.map((dataset) => this.singular(dataset, { context: false }))
      ),
    }
  }

  async singular(
    dataset: Dataset,
    options: SingularOptions = { context: true }
  ): Promise<ObjectType> {
    const id = UrlService.make('protocol.datasets.show', { id: dataset.id })
    const url = UrlService.make('datasets.show', { slug: dataset.slug })

    const result: ObjectType = {
      '@context': options.context ? JSON_LD_CONTEXT : undefined,
      'type': 'Dataset',
      'id': id,
      'url': url,
      'name': dataset.name,
      'published': dataset.createdAt.toFormat(XSDDateFormat),
      'endpoints': {
        changes: UrlService.make('protocol.datasets.changes', { dataset_id: dataset.id }),
        snapshot: UrlService.make('protocol.datasets.snapshot', { dataset_id: dataset.id }),
      },
    }

    if (dataset.updatedAt !== null) {
      result.updated = dataset.updatedAt.toFormat(XSDDateFormat)
    }

    if (dataset.summary) result.summary = dataset.summary
    if (dataset.description) result.content = markdown.render(dataset.description)

    return result
  }
}
