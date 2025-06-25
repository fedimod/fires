import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import localeLanguages from 'bcp47-language-tags'
import type { BCP47LanguageTags, BCP47LanguageTagName } from 'bcp47-language-tags'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const availableLanguages = Object.keys(localeLanguages)

type LocalisedLocale = {
  name: string
  nativeName: string
}

export default class LocalesTranslate extends BaseCommand {
  static commandName = 'locales:translate'
  static description = 'Writes the names of the locales to a locale file'

  static options: CommandOptions = {}

  @args.string()
  declare sourceLocale: string

  @args.string()
  declare locale: string

  async run() {
    if (!availableLanguages.includes(this.sourceLocale)) {
      this.logger.fatal(`Could not find translations for: ${this.sourceLocale}`)
      this.exitCode = 1
      return
    }

    const localePath = this.app.languageFilesPath(this.locale)
    const stats = await fs.stat(localePath).catch((err) => {
      if (err.code === 'ENOENT') {
        this.logger.error(`Could not find directory: ${localePath}`)
        return {
          isDirectory() {
            return false
          },
        }
      } else {
        throw err
      }
    })

    if (!stats.isDirectory()) {
      return
    }

    const localised = localeLanguages[
      this.sourceLocale as keyof typeof localeLanguages
    ] as BCP47LanguageTags

    const { default: locales } = await import(this.app.configPath('locales.ts'))

    const result = locales.reduce(
      (
        localisations: Record<BCP47LanguageTagName, LocalisedLocale>,
        locale: BCP47LanguageTagName
      ) => {
        localisations[locale] = {
          name: localised[locale].name,
          nativeName: localised[locale].nativeName,
        }

        return localisations
      },
      {}
    )

    const messagesPath = path.join(localePath, 'messages.json')
    const messages = JSON.parse(await fs.readFile(messagesPath, { encoding: 'utf-8' }))

    messages['locales'] = result

    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), { encoding: 'utf-8' })

    this.logger.info(`Written to: ${messagesPath.replace(this.app.appRoot.pathname, '')}`)
  }
}
