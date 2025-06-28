import Dataset from '#models/dataset'
import DatasetChange from '#models/dataset_change'
import Label from '#models/label'
import vine from '@vinejs/vine'

const entityKeySchema = vine
  .group([
    vine.group.if((_data, field) => field.parent.entity_kind === 'domain', {
      entity_key: vine
        .string()
        .regex(/([\-\w]{1,63}\.)+([\-\w]{1,63})/)
        .maxLength(256),
    }),
    vine.group.if((_data, field) => field.parent.entity_kind === 'actor', {
      entity_key: vine
        .string()
        .url({
          protocols: ['https'],
          require_protocol: true,
          disallow_auth: true,
          allow_fragments: true,
        })
        .minLength(11),
    }),
  ])
  .otherwise((_, field) => {
    field.report('Invalid entity key', 'invalid_entity_key', field)
  })

export const datasetChangeSchema = vine
  .object({
    type: vine.enum((field) => {
      if (field.parent.change_id) {
        return ['recommendation', 'advisory', 'retraction']
      } else {
        return ['recommendation', 'advisory']
      }
    }),
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
    entity_kind: vine.enum(DatasetChange.entities),
  })
  .merge(entityKeySchema)

export const createDatasetChangeValidator = vine.compile(
  vine
    .object({
      params: vine.object({
        dataset_id: vine.string().uuid().exists({
          table: Dataset.table,
          column: 'id',
        }),
      }),

      ...datasetChangeSchema.getProperties(),
    })
    .merge(entityKeySchema)
)

export const newDatasetChangeValidator = vine.compile(
  vine.object({
    params: vine.object({
      dataset_id: vine.string().uuid().exists({
        table: Dataset.table,
        column: 'id',
      }),
    }),

    change_id: vine
      .string()
      .uuid()
      .exists({
        table: DatasetChange.table,
        column: 'id',
      })
      .optional(),
  })
)

export const listDatasetChangesValidator = vine.compile(
  vine.object({
    params: vine.object({
      dataset_id: vine.string().uuid(),
    }),

    page: vine.number().positive().withoutDecimals().optional(),
  })
)
