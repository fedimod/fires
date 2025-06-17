import vine from '@vinejs/vine'

export const settingsValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(255).minLength(1),
    summary: vine.string().maxLength(500).minLength(1),
    description: vine.string().nullable(),

    contact_email: vine.string().email(),

    appeals_url: vine
      .string()
      .url({
        require_protocol: true,
        protocols: ['https'],
        validate_length: false,
      })
      .nullable(),

    documentation_url: vine
      .string()
      .url({
        require_protocol: true,
        protocols: ['https'],
        validate_length: false,
      })
      .nullable(),
  })
)
