import vine from '@vinejs/vine'

export const settingsValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).minLength(1),
    summary: vine.string().trim().maxLength(500).minLength(1),
    description: vine.string().trim().nullable(),

    contact_email: vine.string().trim().email(),

    appeals_url: vine
      .string()
      .trim()
      .url({
        require_protocol: true,
        protocols: ['https'],
        validate_length: false,
      })
      .nullable(),

    documentation_url: vine
      .string()
      .trim()
      .url({
        require_protocol: true,
        protocols: ['https'],
        validate_length: false,
      })
      .nullable(),
  })
)
