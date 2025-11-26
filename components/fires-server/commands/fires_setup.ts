import Setting from '#models/setting'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import vine from '@vinejs/vine'

export default class FiresSetup extends BaseCommand {
  static commandName = 'fires:setup'
  static description = 'Configuration tool to help setup a FIRES server'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.boolean({
    description: 'Forcefully re-runs the configuration wizard for FIRES',
    alias: 'f',
    default: false,
  })
  declare force: boolean

  private async checkExistingSettings() {
    return await Setting.query()
      .count('* as count')
      .first()
      .then((result) => result?.$extras.count > 0)
  }

  ACCOUNT_RE = /^(@?)([a-z0-9_]+)([\.\-a-z0-9_]+)\@(\w+([.-]+\w+)+)$/im

  emailValidator = vine.compile(vine.string().email())
  accountValidator = vine.compile(vine.string().regex(this.ACCOUNT_RE))
  urlValidator = vine.compile(
    vine.string().url({
      require_protocol: true,
      protocols: ['https'],
      disallow_auth: true,
    })
  )

  async run() {
    if ((await this.checkExistingSettings()) && !this.force) {
      this.logger.error('This FIRES server already appears to be configured.')
      this.logger.error('If you would like to reconfigure, please re-run with: --force')
      this.exitCode = 1
      return this.terminate()
    }

    let name: string = ''
    let summary: string = ''
    let contactEmail: string = ''
    let contactAccount: string = ''
    let documentationUrl: string = ''
    let appealsUrl: string = ''

    let correct = false
    while (!correct) {
      name = await this.prompt.ask('Please name your new FIRES server:\n', {
        default: name,
      })

      summary = await this.prompt.ask('Please give your new FIRES server a summary:\n', {
        default: summary,
      })

      contactAccount = await this.prompt.ask('What is the contact fediverse account?', {
        hint: '@user@server.example',
        validate: async (value) => {
          const [error] = await this.accountValidator.tryValidate(value, {
            messagesProvider: {
              getMessage: () => {
                return 'Must be in the format of @user@server.example, the leading @ is optional'
              },
            },
          })
          return error === null ? true : error.messages[0].message
        },
        default: contactAccount,
      })

      contactEmail = await this.prompt.ask('What is the contact email?', {
        hint: 'Will be publicly available',
        validate: async (value) => {
          const [error] = await this.emailValidator.tryValidate(value)
          return error === null ? true : error.messages[0].message
        },
        default: contactEmail,
      })

      documentationUrl = await this.prompt.ask('Do you have a website with documentation?', {
        hint: 'https://...',
        validate: async (value) => {
          if (value.length === 0) {
            return true
          }

          const [error] = await this.urlValidator.tryValidate(value)
          return error === null ? true : error.messages[0].message
        },
        default: documentationUrl,
      })

      appealsUrl = await this.prompt.ask(
        'Where can people appeal a moderation decisions on your FIRES server?',
        {
          hint: 'https://...',
          validate: async (value) => {
            const [error] = await this.urlValidator.tryValidate(value)
            return error === null ? true : error.messages[0].message
          },
          default: appealsUrl,
        }
      )

      this.logger.info(`
        Server Name: ${name}
        Server Summary: ${summary}
        Contact Email: ${contactEmail}
        Contact Account: ${contactAccount}

        Documentation URL: ${documentationUrl}
        Appeals URL: ${appealsUrl}
      `)

      correct = await this.prompt.confirm('Is this correct?', { default: true })
    }

    await Setting.updateOrCreateMany('key', [
      {
        key: 'name',
        value: name,
      },
      {
        key: 'summary',
        value: summary,
      },
      {
        key: 'contact_email',
        value: contactEmail,
      },
      {
        key: 'contact_account',
        value: contactAccount,
      },
      {
        key: 'documentation_url',
        value: documentationUrl,
      },
      {
        key: 'appeals_url',
        value: appealsUrl,
      },
    ])
  }
}
