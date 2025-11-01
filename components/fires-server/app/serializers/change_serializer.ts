import Dataset from '#models/dataset'
import DatasetChange, { GENISIS_ID } from '#models/dataset_change'
import { UrlService } from '#services/url_service'
import { getJsonLdContext, JSON_LD_CONTEXT, ObjectType, XSDDateFormat } from '#utils/jsonld'

const typeMap = {
  recommendation: 'Recommendation',
  advisory: 'Advisory',
  retraction: 'Retraction',
  tombstone: 'Tombstone',
}

export type ChangesParams = {
  since: string
  page: boolean
  last: DatasetChange | null
  next: DatasetChange | null
  records?: DatasetChange[]
  total: number
}

export const ChangeFields = [
  'entity_kind',
  'entity_key',
  'labels',
  'recommended_policy',
  'recommended_filters',
]

export class ChangeSerializer {
  private pageUrl(collectionId: string, id: string | undefined): string | undefined {
    if (!id) return undefined

    const url = new URL(collectionId)
    url.searchParams.set('since', id)
    return url.href
  }

  async collection(dataset: Dataset, { since, page, last, next, records, total }: ChangesParams) {
    const collectionId = UrlService.make('protocol.datasets.changes', { dataset_id: dataset.id })
    const datasetId = UrlService.make('protocol.datasets.show', { id: dataset.id })
    const lastRecordId = records?.at(-1)?.id
    const pageId = this.pageUrl(collectionId, since)
    const nextUrl = this.pageUrl(collectionId, next?.id ?? lastRecordId)
    const firstUrl = total > 0 ? this.pageUrl(collectionId, GENISIS_ID) : undefined
    const lastUrl = this.pageUrl(collectionId, last?.id)

    return {
      '@context': JSON_LD_CONTEXT,
      'id': page ? pageId : collectionId,
      'partOf': page ? collectionId : undefined,
      'type': page ? 'OrderedCollectionPage' : 'OrderedCollection',
      'dataset': datasetId,
      'totalItems': total,
      'first': firstUrl,
      'last': lastUrl,
      'next': page ? nextUrl : firstUrl,
      'orderedItems': total === 0 ? [] : this.items(records),
    }
  }

  items(items?: DatasetChange[]) {
    if (!items) return undefined

    return items.map((change) => this.item(change))
  }

  item(change: DatasetChange): ObjectType {
    const id = UrlService.make('protocol.datasets.change', {
      dataset_id: change.datasetId,
      id: change.id,
    })

    const response: ObjectType = {
      id: id,
      type: typeMap[change.type],
      published: change.createdAt.toFormat(XSDDateFormat),
    }

    if (change.type !== 'tombstone') {
      response['entity_kind'] = change.entityKind
      response['entity_key'] = change.entityKey

      response['labels'] = change.labels.map((label) => {
        return UrlService.make('protocol.labels.show', { id: label })
      })
    }

    if (change.type === 'recommendation') {
      response['recommended_policy'] = change.recommendedPolicy
      response['recommended_filters'] = change.recommendedFilters ?? []
    }

    return response
  }
}
