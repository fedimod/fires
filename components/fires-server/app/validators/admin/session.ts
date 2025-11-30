import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string(),
    returnPath: vine
      .string()
      .optional()
      .transform<string>((value) => {
        if (typeof value !== 'string') return ''
        return value
      }),
  })
)
