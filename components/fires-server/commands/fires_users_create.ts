import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'

export default class FiresUsersCreate extends BaseCommand {
  static commandName = 'fires:users:create'
  static description = 'Create a user for the admin panel'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const username = await this.prompt.ask('Username', {
      validate(value) {
        return value.length > 0
      },
    })

    const password = await this.prompt.secure('Password', {
      validate(value) {
        return value.length >= 8
      },
    })

    const status = this.logger.action('Creating User')
    try {
      await User.create({ username, password })
      status.displayDuration().succeeded()
    } catch (error) {
      status.failed(error)
    }
  }
}
