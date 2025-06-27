import { VineString } from '@vinejs/vine'
import { localeRule, Options } from '#start/vine-rules/locale'

declare module '@vinejs/vine' {
  interface VineString {
    locale(options?: Options): this
  }
}

VineString.macro('locale', function (this: VineString, options?: Options) {
  return this.use(localeRule(options ?? {}))
})
