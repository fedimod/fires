import Label from '#models/label'
import vine from '@vinejs/vine'

export const labelSchema = vine.object({
  name: vine.string().unique({
    table: Label.table,
    column: 'name',
    caseInsensitive: true,
  }),
  summary: vine.string().optional(),
  description: vine.string().optional(),
})

export const createLabelValidator = vine.compile(labelSchema.clone())

export const updateLabelValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().uuid({ version: [4] }),
    }),

    ...labelSchema.getProperties(),
  })
)
