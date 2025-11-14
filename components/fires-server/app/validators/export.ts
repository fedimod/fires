import vine from '@vinejs/vine'

export const exportValidator = vine.compile(
  vine.object({
    params: vine.object({
      dataset_id: vine.string().uuid(),
    }),
  })
)
