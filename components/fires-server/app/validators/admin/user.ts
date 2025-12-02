import User from '#models/user'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

const adminOrPermissionsRequired = vine.createRule(
  async (value: unknown, _options: undefined, field: FieldContext) => {
    if (!field.isValid) {
      return
    }

    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return
    }

    if (!Object.hasOwn(value, 'isAdmin') && !Object.hasOwn(value, 'permissions')) {
      field.report(
        'The account needs to be either an admin or have specific permissions assigned',
        'required',
        { ...field, name: 'adminOrPermissions', variableName: 'adminOrPermissions' }
      )
      return
    }

    return value
  }
)

const userId = vine.number().positive().withoutDecimals().exists({
  table: User.table,
  column: 'id',
})

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
  vine
    .object({
      username: usernameValidator,
      password: passwordValidator,

      isAdmin: vine.accepted().optional(),
      permissions: vine.array(vine.enum(User.permissions)).optional(),
    })
    .use(adminOrPermissionsRequired())
)

export const editUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: userId,
    }),
  })
)

export const updateUserValidator = vine.compile(
  vine
    .object({
      params: vine.object({
        id: userId,
      }),

      username: usernameValidator.optional(),
      password: passwordValidator.optional(),

      isAdmin: vine.accepted().optional(),
      permissions: vine.array(vine.enum(User.permissions)).optional(),
    })
    .use(adminOrPermissionsRequired())
)

export const deleteUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: userId,
    }),
  })
)
