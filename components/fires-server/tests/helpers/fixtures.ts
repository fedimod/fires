import type { Abortable } from 'node:events'
import type { ObjectEncodingOptions } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

type ReadFileOptions = ObjectEncodingOptions & Abortable

const fixturesPath = new URL('../fixtures/', import.meta.url)
const fixtureCache = new Map<string, string | Buffer<ArrayBufferLike>>()
const pathCache = new Map<string, string>()

export async function fixture(name: string, options?: ReadFileOptions) {
  const cached = fixtureCache.get(name)
  if (cached) {
    return typeof cached === 'string' ? `${cached}` : Buffer.copyBytesFrom(cached)
  }

  const filepath = fileURLToPath(new URL(name, fixturesPath))
  const data = await readFile(filepath, { ...options, flag: 'r' })

  fixtureCache.set(name, data)

  return typeof data === 'string' ? `${data}` : Buffer.copyBytesFrom(data)
}

export function fixturePath(name: string): string {
  const cached = pathCache.get(name)
  if (cached) return cached

  const path = fileURLToPath(new URL(name, fixturesPath))
  pathCache.set(name, path)

  return path
}
