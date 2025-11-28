import User from '#models/user'
import vine from '@vinejs/vine'

export const updateAccountValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(1)
      .regex(/^[\w@\.\+]+$/)
      .unique({
        table: User.table,
        column: 'username',
        caseInsensitive: true,
        filter(db, _value, field) {
          db.andWhereNot('id', field.meta.user_id)
        },
      }),

    password: vine.string().minLength(8).confirmed().optional(),
  })
)
