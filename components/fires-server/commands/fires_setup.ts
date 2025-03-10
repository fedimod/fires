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

    let description: string = ''
    let contactEmail: string = ''
    let contactAccount: string = ''
    let providerUrl: string = ''
    let documentationUrl: string = ''
    let appealsUrl: string = ''
    let redirectUrl: string | undefined
    let redirect: boolean = false

    let correct = false
    while (!correct) {
      description = await this.prompt.ask(
        'Please give your new FIRES server a short description:\n',
        { default: description }
      )

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

      providerUrl = await this.prompt.ask('Where is your website as a FIRES server provider?', {
        hint: 'https://...',
        validate: async (value) => {
          const [error] = await this.urlValidator.tryValidate(value)
          return error === null ? true : error.messages[0].message
        },
        default: providerUrl,
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

      redirect = await this.prompt.confirm(
        'Would you like to redirect visitors to a different URL for this server?',
        {
          default: redirect,
        }
      )

      if (redirect) {
        redirectUrl = await this.prompt.ask('Which URL?', {
          hint: 'https://...',
          validate: async (value) => {
            const [error] = await this.urlValidator.tryValidate(value)
            return error === null ? true : error.messages[0].message
          },
          default: redirectUrl,
        })
      }

      this.logger.info(`
        Description: ${description}
        Contact Email: ${contactEmail}
        Contact Account: ${contactAccount}

        Provider URL: ${providerUrl}
        Documentation URL: ${documentationUrl}
        Appeals URL: ${appealsUrl}
        ${redirect ? `Redirect URL: ${redirectUrl}` : ''}
      `)

      correct = await this.prompt.confirm('Is this correct?', { default: true })
    }

    await Setting.updateOrCreateMany('key', [
      {
        key: 'description',
        value: description,
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
        key: 'provider_url',
        value: providerUrl,
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

    if (redirect && redirectUrl) {
      await Setting.updateOrCreate(
        { key: 'redirect_url' },
        {
          value: redirectUrl,
        }
      )
    }
  }
}
