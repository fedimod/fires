import Label from '#models/label'
import vine from '@vinejs/vine'

export const labelSchema = vine.object({
  locale: vine.string().locale().optional(),
  name: vine.string().unique({
    table: Label.table,
    column: 'name',
    caseInsensitive: true,
    filter(db, _value, field) {
      if (field.parent?.params?.id) {
        db.andWhereNot('id', field.parent.params.id)
      }
    },
  }),
  summary: vine.string().optional(),
  description: vine.string().optional(),

  translations: vine
    .array(
      vine.object({
        name: vine
          .string()
          .optional()
          .requiredWhen((field) => {
            // hack, I'm pretty sure I shouldn't use `field.data`
            return !!field.data.name
          }),
        summary: vine
          .string()
          .optional()
          .requiredWhen((field) => {
            // hack, I'm pretty sure I shouldn't use `field.data`
            return !!field.data.summary
          }),
        description: vine
          .string()
          .optional()
          .requiredWhen((field) => {
            // hack, I'm pretty sure I shouldn't use `field.data`
            return !!field.data.description
          }),
        locale: vine.string().locale(),
      })
    )
    .parse((translations) => {
      if (!Array.isArray(translations)) {
        return []
      }

      return translations.filter(
        (translation) => translation.name || translation.summary || translation.description
      )
    })
    .distinct('locale'),
})

export const createLabelValidator = vine.compile(labelSchema.clone())

export const updateLabelValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().uuid(),
    }),

    ...labelSchema.getProperties(),
  })
)

export const showLabelValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().uuid(),
    }),

    locale: vine.string().locale().optional(),
  })
)
