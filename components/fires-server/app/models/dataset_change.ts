import { belongsTo, column } from '@adonisjs/lucid/orm'
import { jsonArrayColumn, UuidBaseModel } from '#utils/lucid_extensions'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Dataset from '#models/dataset'
import { UUIDv7 } from '#utils/uuid'

export const GENISIS_ID: UUIDv7 = '00000000-0000-7000-A000-000000000000'

export type EntityKind = (typeof DatasetChange.entities)[number]
export type ChangeType = (typeof DatasetChange.types)[number]
export type RecommendedPolicy = (typeof DatasetChange.policies)[number]
export type RecommendedFilters = string[]

export default class DatasetChange extends UuidBaseModel {
  static entities = ['domain', 'actor'] as const
  static types = ['advisory', 'recommendation', 'retraction', 'tombstone'] as const
  static policies = ['accept', 'filter', 'reject', 'drop'] as const

  static changeTypes: ChangeType[] = ['advisory', 'recommendation'] as const

  @column()
  declare datasetId: string

  @belongsTo(() => Dataset)
  declare dataset: BelongsTo<typeof Dataset>

  @column()
  declare entityKind: EntityKind

  @column()
  declare entityKey: string

  @column()
  declare type: ChangeType

  @jsonArrayColumn()
  declare labels: string[]

  @column()
  declare recommendedPolicy?: RecommendedPolicy

  @column()
  declare recommendedFilter: RecommendedFilters

  @column()
  declare comment: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  static async latestForEntity(
    dataset_id: string,
    entity_kind: EntityKind,
    entity_key: string
  ): Promise<DatasetChange | null> {
    return DatasetChange.query()
      .where({
        dataset_id: dataset_id,
        entity_kind: entity_kind,
        entity_key: entity_key,
      })
      .orderBy('id', 'desc')
      .first()
  }
}
