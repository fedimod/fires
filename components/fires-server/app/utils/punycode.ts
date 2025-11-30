import { toASCII as punycodeToASCII, toUnicode as punycodeToUnicode } from 'punycode'
export {
  toASCII as punycodeToASCII,
  toUnicode as punycodeToUnicode,
  decode as punycodeDecode,
} from 'punycode'

export function isPunycoded(input: string): boolean {
  return input !== punycodeToUnicode(input)
}

export function normalizeDomain(input: string) {
  return punycodeToASCII(input.trim())
}

export function normalizeUrl(input: string) {
  if (URL.canParse(input)) {
    const parsed = URL.parse(input)!
    if (parsed.hostname) {
      parsed.hostname = punycodeToASCII(parsed.hostname)
    }
    return parsed.toString()
  }
  return input
}
