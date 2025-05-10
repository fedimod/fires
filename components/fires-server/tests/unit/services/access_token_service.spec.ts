import { test } from '@japa/runner'
import sinon from 'sinon'

import AccessToken from '#models/access_token'
import AccessTokenService, {
  createHmac,
  IDENTIFIER_LENGTH,
  TOKEN_PREFIX,
} from '#services/access_token_service'
import { Secret } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'
import timeTravel from '#tests/helpers/time_travel'
import timekeeper from 'timekeeper'

test.group('AccessTokenService.mint', () => {
  test('Correctly mints an access token', async ({ assert }) => {
    const token = AccessTokenService.mint().release()

    // prefix + identifier(32) + period + hmac min length
    assert.ok(token.length >= TOKEN_PREFIX.length + IDENTIFIER_LENGTH + 2)
    assert.ok(token.startsWith(TOKEN_PREFIX), 'Token starts with fires_')

    const components = token.slice(TOKEN_PREFIX.length).split('.')

    assert.equal(components.length, 2)
    assert.equal(components[1], createHmac(components[0]))
  })
})

test.group('AccessTokenService.create', () => {
  test('successfully creates an access token', async ({ assert }) => {
    const token = await AccessTokenService.create(['read'], 'Test: read')

    assert.instanceOf(token, AccessToken)
    assert.instanceOf(token.token, Secret)

    // Freshly created tokens should never have been used:
    assert.isNull(token.lastUsedAt)

    assert.sameMembers(token.abilities, ['read'])
    assert.equal(token.description, 'Test: read')
  })
})

test.group('AccessTokenService.verify', (group) => {
  let accessTokenMock: sinon.SinonMock
  group.each.setup(() => {
    accessTokenMock = sinon.mock(AccessToken)
    return () => accessTokenMock.restore()
  })

  test('fails if the token only contains the prefix', async ({ assert }) => {
    accessTokenMock.expects('findBy').never()

    const token = 'fires_'
    assert.isNull(await AccessTokenService.verify(token))
    assert.doesNotThrow(() => accessTokenMock.verify())
  })

  test("fails if token prefix isn't correct", async ({ assert }) => {
    accessTokenMock.expects('findBy').never()

    const token = AccessTokenService.mint().release().replace('fires_', 'aot_')
    assert.isNull(await AccessTokenService.verify(token))
    assert.doesNotThrow(() => accessTokenMock.verify())
  })

  test("fails if we don't have correct format", async ({ assert }) => {
    accessTokenMock.expects('findBy').never()

    const token = AccessTokenService.mint().release().replace('.', ':')
    assert.isNull(await AccessTokenService.verify(token))
    assert.doesNotThrow(() => accessTokenMock.verify())
  })

  test("fails if we don't have correct identifier length", async ({ assert }) => {
    accessTokenMock.expects('findBy').never()

    const token = 'fires_notAnIdentifier.hash'
    assert.isNull(await AccessTokenService.verify(token))
    assert.doesNotThrow(() => accessTokenMock.verify())
  })

  test("fails if we don't have a hmac", async ({ assert }) => {
    accessTokenMock.expects('findBy').never()

    const token = AccessTokenService.mint()
      .release()
      .slice(TOKEN_PREFIX.length + IDENTIFIER_LENGTH + 1)

    assert.isNull(await AccessTokenService.verify(token))
    assert.doesNotThrow(() => accessTokenMock.verify())
  })

  test("fails if the hmac isn't correct", async ({ assert }) => {
    accessTokenMock.expects('findBy').never()

    const token = AccessTokenService.mint().release() + 'fail'

    assert.isNull(await AccessTokenService.verify(token))
    assert.doesNotThrow(() => accessTokenMock.verify())
  })

  test('fetches from the database if valid, but can return null', async ({ assert }) => {
    accessTokenMock.expects('findBy').once().returns(null)
    const token = AccessTokenService.mint().release()

    assert.isNull(await AccessTokenService.verify(token))
    assert.doesNotThrow(() => accessTokenMock.verify())
  })

  test('fetches from the database if valid and returns token', async ({ assert }) => {
    const token = await AccessTokenService.create([], '')
    accessTokenMock.expects('findBy').once().returns(token)

    const result = await AccessTokenService.verify(token.token.release())
    assert.isNotNull(result)
    assert.doesNotThrow(() => accessTokenMock.verify())
    assert.equal(result, token)
  })
})

test.group('AccessTokenService.touch', (group) => {
  group.each.setup(() => {
    timekeeper.freeze()
    return () => timekeeper.reset()
  })

  test('it does not update if the token was touched recently', async ({ assert }) => {
    const token = await AccessTokenService.create([], '')

    const originalTime = DateTime.now()
    await token.merge({ lastUsedAt: originalTime }).save()

    const saveSpy = sinon.spy(token, 'save')

    await AccessTokenService.touch(token)

    assert.equal(token.lastUsedAt, originalTime)
    assert.equal(saveSpy.callCount, 0)
  })

  test('it updates if the token has not been used', async ({ assert }) => {
    let token = await AccessTokenService.create([], '')
    const saveSpy = sinon.spy(token, 'save')

    assert.isNull(token.lastUsedAt)

    await AccessTokenService.touch(token)

    token = await token.refresh()
    assert.isNotNull(token.lastUsedAt)

    assert.equal(saveSpy.callCount, 1)
    assert.equal(token.lastUsedAt?.valueOf(), Date.now())
  })

  test('it should not update if the token was used within the last day', async ({ assert }) => {
    const originalTime = DateTime.now()
    let token = await AccessTokenService.create([], '')
    token = await token.merge({ lastUsedAt: originalTime }).save()

    const saveSpy = sinon.spy(token, 'save')

    // Move forwards by two hours:
    timeTravel.plus({ hours: 2 })

    await AccessTokenService.touch(token)

    assert.equal(token.lastUsedAt?.valueOf(), originalTime.valueOf())
    assert.equal(saveSpy.callCount, 0)
  })

  test('it updates if the token was not touched recently', async ({ assert }) => {
    const originalTime = DateTime.now()
    let token = await AccessTokenService.create([], '')
    token = await token.merge({ lastUsedAt: originalTime }).save()

    const saveSpy = sinon.spy(token, 'save')

    // Move forwards by two days:
    timeTravel.plus({ days: 2 })

    await AccessTokenService.touch(token)

    assert.notEqual(token.lastUsedAt?.valueOf(), originalTime.valueOf())
    assert.equal(token.lastUsedAt?.valueOf(), Date.now())
    assert.equal(saveSpy.callCount, 1)
  })

  test('it updates if the token was not touched in the future somehow', async ({ assert }) => {
    const originalTime = DateTime.now().plus({ day: 1 })
    let token = await AccessTokenService.create([], '')
    token = await token.merge({ lastUsedAt: originalTime }).save()

    const saveSpy = sinon.spy(token, 'save')

    await AccessTokenService.touch(token)

    assert.notEqual(token.lastUsedAt?.valueOf(), originalTime.valueOf())
    assert.equal(token.lastUsedAt?.valueOf(), Date.now())
    assert.equal(saveSpy.callCount, 1)
  })
})
