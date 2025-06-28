import { ObjectType, XSDDateFormat } from '#utils/jsonld'
import markdown from '#utils/markdown'
import { UrlService } from '#services/url_service'
import Dataset from '#models/dataset'

export class DatasetSerializer {
  async singular(dataset: Dataset): Promise<ObjectType> {
    const id = UrlService.make('protocol.datasets.show', { id: dataset.id })
    const url = UrlService.make('datasets.show', { slug: dataset.slug })

    const result: ObjectType = {
      type: 'Dataset',
      id: id,
      url: url,
      name: dataset.name,
      published: dataset.createdAt.toFormat(XSDDateFormat),
    }

    if (dataset.updatedAt !== null) {
      result.updated = dataset.updatedAt.toFormat(XSDDateFormat)
    }

    if (dataset.summary) result.summary = dataset.summary
    if (dataset.description) result.content = markdown.render(dataset.description)

    result.endpoints = {
      changes: UrlService.make('protocol.datasets.changes', { dataset_id: dataset.id }),
      snapshot: UrlService.make('protocol.datasets.snapshot', { dataset_id: dataset.id }),
    }

    return result
  }
}
