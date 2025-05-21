import AccessToken from '#models/access_token'
import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { errors } from '@adonisjs/lucid'
import { DateTime } from 'luxon'

export default class FiresTokensDelete extends BaseCommand {
  static commandName = 'fires:tokens:delete'
  static description = 'Delete an access token'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string()
  declare token: string

  async run() {
    const table = this.ui
      .table()
      .head(['Token (truncated)', 'Description', 'Abilities', 'Last Used At'])

    let token: AccessToken | null = null

    try {
      token = await AccessToken.query().whereLike('token', `${this.token}%`).firstOrFail()
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        this.logger.error(`Could not find access token: ${this.token}`)
        this.exitCode = 1
        return this.terminate()
      }

      throw error
    }

    table
      .row([
        token.token.release().split('.')[0],
        token.description,
        token.abilities.join(' '),
        token.lastUsedAt?.toLocaleString(DateTime.DATETIME_SHORT) ?? '-',
      ])
      .render()

    const deleteToken = await this.prompt.confirm('Is this the token you wish to delete?')

    if (!deleteToken) {
      this.logger.success('Okay, nothing to do.')
      return this.terminate()
    }

    const deleteTokenAction = this.logger.action('Deleting Access Token')
    try {
      await token.delete()
      deleteTokenAction.displayDuration().succeeded()
    } catch (error) {
      deleteTokenAction.failed(error)
      this.exitCode = 1
    }
  }
}
