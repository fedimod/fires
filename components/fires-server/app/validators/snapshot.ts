import vine from '@vinejs/vine'

export const snapshotRequestValidator = vine.compile(
  vine.object({
    params: vine.object({
      dataset_id: vine.string().uuid(),
    }),
  })
)
