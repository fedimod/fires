import { test } from '@japa/runner'

import { uuidv7 } from '#utils/uuid'

const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

test.group('uuidv7', () => {
  test('generates valid UUIDv7 values', ({ assert }) => {
    const value = uuidv7()

    assert.match(value, UUID_V7_PATTERN)
  })

  test('embeds the current unix timestamp in milliseconds', ({ assert }) => {
    const before = Date.now()
    const value = uuidv7()
    const after = Date.now()

    const timestamp = Number.parseInt(value.replaceAll('-', '').slice(0, 12), 16)

    assert.isAtLeast(timestamp, before)
    assert.isAtMost(timestamp, after)
  })

  test('generates different values', ({ assert }) => {
    const values = new Set(Array.from({ length: 100 }, () => uuidv7()))

    assert.equal(values.size, 100)
  })
})
