import User from '#models/user'
import vine from '@vinejs/vine'

const userId = vine.number().positive().withoutDecimals()

export const usernameValidator = vine
  .string()
  .minLength(1)
  .regex(/^[\w@\.\+]+$/)
  .unique({
    table: User.table,
    column: 'username',
    caseInsensitive: true,
    filter(db, _value, field) {
      if (field.meta && field.meta.user_id && !Number.isNaN(field.meta.user_id)) {
        db.whereRaw('id != ?', [field.meta.user_id])
      }
    },
  })

export const passwordValidator = vine.string().minLength(8).confirmed()

export const createUserValidator = vine.compile(
  vine.object({
    username: usernameValidator,
    password: passwordValidator,

    isAdmin: vine.accepted().optional(),
    permissions: vine
      .array(vine.enum(User.permissions))
      .optional()
      .requiredWhen('isAdmin', '!=', true),
  })
)
export const editUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: userId,
    }),
  })
)
export const updateUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: userId,
    }),

    username: usernameValidator.optional(),
    password: passwordValidator.optional(),

    isAdmin: vine.accepted().optional(),
    permissions: vine.array(vine.enum(User.permissions)).optional(),
  })
)
export const deleteUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: userId,
    }),
  })
)
