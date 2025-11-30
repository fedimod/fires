import Dataset from '#models/dataset'
import DatasetChange from '#models/dataset_change'
import Label from '#models/label'
import { normalizeDomain, normalizeUrl } from '#utils/punycode'
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

export const entityKeyDomain = vine
  .string()
  .trim()
  .minLength(1)
  .maxLength(256)
  .parse((value) => {
    if (typeof value !== 'string') return value
    return normalizeDomain(value)
  })
  .use(domainValidator())

export const entityKeyActor = vine
  .string()
  .url({
    protocols: ['https'],
    require_protocol: true,
    disallow_auth: true,
    allow_fragments: true,
  })
  .trim()
  .minLength(11)
  .transform(normalizeUrl)

const entitySchema = vine.group([
  vine.group.if((_data, field) => field.parent.entity.kind === 'domain', {
    kind: vine.literal('domain'),
    key: entityKeyDomain,
  }),
  vine.group.if((_data, field) => field.parent.entity.kind === 'actor', {
    kind: vine.literal('actor'),
    key: entityKeyActor,
  }),
])

const properties = vine.object({
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

  comment: vine.string().trim().minLength(1).optional(),
})

export const reviseDatasetChangeValidator = vine.compile(
  vine.object({
    params: vine.object({
      dataset_id: vine.string().uuid().exists({
        table: Dataset.table,
        column: 'id',
      }),
    }),

    change_id: vine.string().uuid().exists({
      table: DatasetChange.table,
      column: 'id',
    }),

    ...properties.getProperties(),
  })
)

export const newDatasetChangeValidator = vine.compile(
  vine.object({
    params: vine.object({
      dataset_id: vine.string().uuid().exists({
        table: Dataset.table,
        column: 'id',
      }),
    }),

    ...properties.getProperties(),

    entity: vine
      .object({
        kind: vine.enum(DatasetChange.entities),
      })
      .merge(entitySchema),
  })
)

export const createDatasetChangeValidator = vine.compile(
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
