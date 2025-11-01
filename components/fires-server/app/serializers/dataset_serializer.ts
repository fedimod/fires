import { getJsonLdContext, ObjectType, XSDDateFormat } from '#utils/jsonld'
import markdown from '#utils/markdown'
import { UrlService } from '#services/url_service'
import Dataset from '#models/dataset'

const context = getJsonLdContext(['Dataset', 'changes', 'snapshot'])

type SingularOptions = {
  context: boolean
}

export class DatasetSerializer {
  async collection(datasets: Dataset[]) {
    return {
      '@context': context,
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
      '@context': options.context ? context : undefined,
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
