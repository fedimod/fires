import Dataset from '#models/dataset'
import stringHelpers from '@adonisjs/core/helpers/string'
import vine from '@vinejs/vine'

export const datasetSchema = vine.object({
  locale: vine.string().locale().optional(),
  name: vine
    .string()
    .trim()
    .minLength(1)
    .unique({
      table: Dataset.table,
      column: 'name',
      caseInsensitive: true,
      filter(db, value, field) {
        db.andWhereNot('slug', stringHelpers.slug(value))

        if (field.parent?.params?.id) {
          db.andWhereNot('id', field.parent.params.id)
        }
      },
    }),
  summary: vine.string().trim().optional(),
  description: vine.string().trim().optional(),
})

export const createDatasetValidator = vine.compile(datasetSchema.clone())

export const updateDatasetValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().uuid(),
    }),

    ...datasetSchema.getProperties(),
  })
)
