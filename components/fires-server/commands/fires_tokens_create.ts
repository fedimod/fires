import AccessTokenService from '#services/access_token_service'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class FiresTokensCreate extends BaseCommand {
  static commandName = 'fires:tokens:create'
  static description = 'Create an access token'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const description = await this.prompt.ask('Name or description for the Access Token', {
      validate(value) {
        return value.length > 0
      },
    })

    const abilities = await this.prompt.multiple(
      'Select abilities',
      [
        {
          name: 'read',
          message: 'Read data',
        },
        {
          name: 'write',
          message: 'Write data',
        },
        {
          name: 'admin',
          message: 'Administrate the server (including labels)',
        },
      ],
      {
        validate(values) {
          return values.length > 0 ? true : 'Please select at least one option'
        },
      }
    )

    const createToken = this.logger.action('Creating Access Token')
    try {
      const token = await AccessTokenService.create(abilities, description)
      createToken.displayDuration().succeeded()

      const sticker = this.ui.sticker()
      sticker
        .add('Access Token created successfully!')
        .add('')
        .add(`${this.colors.cyan(token.token.release())}`)
        .add('')
        .add(`${this.colors.yellow('Note: This token will not be shown again.')}`)
        .render()
    } catch (error) {
      createToken.failed(error)
    }
  }
}
