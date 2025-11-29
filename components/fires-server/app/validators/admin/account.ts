import vine from '@vinejs/vine'
import { passwordValidator, usernameValidator } from './user.js'

export const updateAccountValidator = vine.compile(
  vine.object({
    username: usernameValidator,
    password: passwordValidator.optional(),
  })
)
