import Dataset from '#models/dataset'
import DatasetChange from '#models/dataset_change'
import Label from '#models/label'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

const domainPartRegex = /^[a-z0-9-]+$/i
const domainValidator = vine.createRule(
  async (value: unknown, _options: undefined, field: FieldContext) => {
    if (typeof value !== 'string') return

    const parts = value.split('.')
    const valid = parts.every((part) => {
      return part.length > 1 && part.length < 63 && domainPartRegex.test(part)
    })

    if (!valid) {
      field.report(
        'The {{field}} field is not a valid domain name',
        field.getFieldPath() + '.domain',
        field
      )
    }
  }
)

export const entityKeyDomain = vine.string().maxLength(256).use(domainValidator())

export const entityKeyActor = vine
  .string()
  .url({
    protocols: ['https'],
    require_protocol: true,
    disallow_auth: true,
    allow_fragments: true,
  })
  .minLength(11)

const entityKeySchema = vine
  .group([
    vine.group.if((_data, field) => field.parent.entity_kind === 'domain', {
      entity_key: entityKeyDomain,
    }),
    vine.group.if((_data, field) => field.parent.entity_kind === 'actor', {
      entity_key: entityKeyActor,
    }),
  ])
  .otherwise((_data, field) => {
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
    comment: vine.string().optional(),
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
