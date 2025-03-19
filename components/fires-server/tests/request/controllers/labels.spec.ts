import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

import { createRequestInjection, createServer } from '#tests/helpers/http_injection_test'

test.group('Controllers / labels', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.teardown(async () => {
    await testUtils.db().truncate()
  })

  test('correctly negotiates to JSON', async ({ assert }) => {
    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request.get('/labels').headers({ accept: 'application/json' }).end()

    assert.equal(response.statusCode, 200)
    assert.equal(response.headers['content-type'], 'application/json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(json['@context'], [
      'https://www.w3.org/ns/activitystreams',
      { Label: 'https://fires.fedimod.org/ns#Label' },
    ])

    assert.equal(json['type'], 'Collection')
    assert.equal(json['totalItems'], 0)
    assert.deepEqual(json['items'], [])
    // fixme: can't really know what the port number is:
    assert.isString(json['id'])
    assert.isString(json['summary'])
  })

  test('correctly negotiates to HTML', async ({ assert }) => {
    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request.get('/labels').headers({ accept: 'text/html' }).end()

    assert.equal(response.statusCode, 200)
    assert.equal(response.headers['content-type'], 'text/html; charset=utf-8')
  })

  test('defaults to HTML when no Accept header is present', async ({ assert }) => {
    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request.get('/labels').end()

    assert.equal(response.statusCode, 200)
    assert.equal(response.headers['content-type'], 'text/html; charset=utf-8')
  })
})
