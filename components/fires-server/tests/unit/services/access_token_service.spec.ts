import { test } from '@japa/runner'
import sinon from 'sinon'

import AccessToken from '#models/access_token'
import AccessTokenService, {
  createHmac,
  IDENTIFIER_LENGTH,
  TOKEN_PREFIX,
} from '#services/access_token_service'
import { Secret } from '@adonisjs/core/helpers'

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

    assert.sameMembers(token.abilities, ['read'])
    assert.equal(token.description, 'Test: read')
  })
})

test.group('AccessTokenService.verify', (group) => {
  let accessTokenMock: sinon.SinonMock
  group.each.setup(() => {
    accessTokenMock = sinon.mock(AccessToken)
  })
  group.each.teardown(() => {
    accessTokenMock.restore()
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
