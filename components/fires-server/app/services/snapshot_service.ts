import DatasetChange from '#models/dataset_change'

export type SnapshotFilter = {
  limit: number
  untilId?: string
}

export type Snapshot = {
  dataset: string
  totalChanges: number
  records: DatasetChange[]
  hasMore: boolean
}

export default class SnapshotService {
  async getSnapshot(dataset_id: string, options?: SnapshotFilter): Promise<Snapshot> {
    const result = await DatasetChange.transaction(async (trx) => {
      const rows = await DatasetChange.query({ client: trx })
        .with('snapshot', (query) => {
          query
            .distinctOn('entity_kind', 'entity_key')
            .where('dataset_id', dataset_id)
            .orderBy(['entity_kind', 'entity_key'])
            .orderBy('id', 'desc')
        })
        .select('*')
        .from('snapshot')
        .orderBy('id', 'desc')
        .if(options?.limit, (q) => q.limit(options?.limit! + 1))
        .if(options?.untilId, (query) => query.where('id', '>', options?.untilId!))

      const { count } = await trx
        .from(DatasetChange.table)
        .where('dataset_id', dataset_id)
        .count('id', 'count')
        .first()

      return {
        rows,
        count,
      }
    })

    const totalChanges = Number.parseInt(result.count, 10)

    if (options?.limit) {
      return {
        dataset: dataset_id,
        totalChanges,
        records: result.rows.slice(0, options.limit),
        hasMore: result.rows.length > options.limit,
      }
    } else {
      return {
        dataset: dataset_id,
        totalChanges,
        records: result.rows,
        hasMore: false,
      }
    }
  }
}
