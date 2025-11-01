import Dataset from '#models/dataset'
import { Snapshot } from '#services/snapshot_service'
import { UrlService } from '#services/url_service'
import { getJsonLdContext, JsonLdDocument, XSDDateFormat } from '#utils/jsonld'
import { inject } from '@adonisjs/core'
import { ChangeFields, ChangeSerializer } from './change_serializer.js'

const context = getJsonLdContext(['dataset', ...ChangeFields])

@inject()
export class SnapshotSerializer {
  constructor(protected changeSerializer: ChangeSerializer) {}

  async collection(snapshot: Snapshot, dataset: Dataset): Promise<JsonLdDocument> {
    const collectionId = UrlService.make('protocol.datasets.snapshot', { dataset_id: dataset.id })
    const datasetId = UrlService.make('protocol.datasets.show', { id: dataset.id })
    const latestRecord = snapshot.records.at(0)

    const response: JsonLdDocument = {
      '@context': context,
      'id': collectionId,
      'type': 'OrderedCollection',
      'summary': `Snapshot for ${dataset.name} dataset`,
      'dataset': datasetId,
      'totalItems': snapshot.records.length,
      'orderedItems': await this.changeSerializer.items(snapshot.records),
    }

    if (latestRecord) {
      response['updated'] = latestRecord.createdAt.toFormat(XSDDateFormat)
      response['changes'] = UrlService.make(
        'protocol.datasets.changes',
        { dataset_id: dataset.id },
        { qs: { since: latestRecord.id } }
      )
    }

    return response
  }
}
