import vine from '@vinejs/vine'

export const datasetChangesRequestValidator = vine.compile(
  vine.object({
    params: vine.object({
      dataset_id: vine.string().uuid(),
    }),

    since: vine
      .string()
      .uuid({ version: [7] })
      .optional(),
  })
)
