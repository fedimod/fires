import * as nodeCrypto from 'node:crypto'

type CryptoModule = typeof import('node:crypto')
type CryptoModuleWithUuidV7 = CryptoModule & { randomUUIDv7?: () => string }

export type UUIDv7 = string

export const uuidv7 = (): UUIDv7 => {
  const nativeUuidv7 = (nodeCrypto as CryptoModuleWithUuidV7).randomUUIDv7
  if (nativeUuidv7) {
    return nativeUuidv7()
  }

  const bytes = Buffer.allocUnsafe(16)
  const timestamp = BigInt(Date.now())
  bytes[0] = Number((timestamp >> 40n) & 0xffn)
  bytes[1] = Number((timestamp >> 32n) & 0xffn)
  bytes[2] = Number((timestamp >> 24n) & 0xffn)
  bytes[3] = Number((timestamp >> 16n) & 0xffn)
  bytes[4] = Number((timestamp >> 8n) & 0xffn)
  bytes[5] = Number(timestamp & 0xffn)

  const random = nodeCrypto.randomBytes(10)
  bytes[6] = 0x70 | (random[0] & 0x0f)
  bytes[7] = random[1]
  bytes[8] = 0x80 | (random[2] & 0x3f)
  random.copy(bytes, 9, 3)

  const value = bytes.toString('hex')
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}` as UUIDv7
}
