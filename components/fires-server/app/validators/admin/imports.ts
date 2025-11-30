import Dataset from '#models/dataset'
import DatasetChange from '#models/dataset_change'
import Label from '#models/label'
import vine from '@vinejs/vine'
import { entityKeyActor, entityKeyDomain } from '#validators/admin/dataset_change'

export const importFileValidator = vine.compile(
  vine.object({
    dataset: vine.string().uuid().exists({
      table: Dataset.table,
      column: 'id',
    }),

    file: vine.file({
      extnames: ['csv'],
      size: '1mb',
    }),

    defaultType: vine.enum(DatasetChange.changeTypes),
  })
)

const entityKeySchema = vine
  .group([
    vine.group.if((data, _field) => data.entity_kind === 'domain', {
      entity_key: entityKeyDomain,
    }),
    vine.group.if((data, _field) => data.entity_kind === 'actor', {
      entity_key: entityKeyActor,
    }),
  ])
  .otherwise((_data, field) => {
    field.report('Invalid entity key', field.getFieldPath() + '.invalid_entity_key', field)
  })

export const importValidator = vine.compile(
  vine.object({
    dataset_id: vine.string().uuid().exists({
      table: Dataset.table,
      column: 'id',
    }),
    changes: vine
      .array(
        vine
          .object({
            type: vine.enum(['recommendation', 'advisory', 'retraction']),
            recommended_policy: vine.enum(DatasetChange.policies),
            labels: vine
              .array(
                vine.string().exists({
                  table: Label.table,
                  column: 'id',
                })
              )
              .distinct()
              .optional(),
            comment: vine.string().optional(),
            entity_kind: vine.enum(DatasetChange.entities),
          })
          .merge(entityKeySchema)
      )
      .parse((value) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return Array.from(Object.values(value))
        }

        return value
      })
      .optional(),
  })
)
