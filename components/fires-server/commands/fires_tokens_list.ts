import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import AccessToken from '#models/access_token'
import { DateTime } from 'luxon'

export default class FiresTokensList extends BaseCommand {
  static commandName = 'fires:tokens:list'
  static description = 'Lists access tokens'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const table = this.ui
      .table()
      .head(['Token (truncated)', 'Description', 'Abilities', 'Last Used At'])
    const tokens = await AccessToken.all()

    if (tokens.length === 0) {
      table.row([{ colSpan: 4, content: 'No Access Tokens Exist' }])
    }

    tokens.forEach((token) => {
      table.row([
        token.token.release().split('.')[0],
        token.description,
        token.abilities.join(' '),
        token.lastUsedAt?.toLocaleString(DateTime.DATETIME_SHORT) ?? '-',
      ])
    })

    table.render()
  }
}
