import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

import { createRequestInjection, createServer } from '#tests/helpers/http_injection_test'
import { LabelFactory } from '#database/factories/label_factory'
import { CONTEXT } from '#serializers/labels_serializer'

test.group('Controllers / labels / content negotiation', (group) => {
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

    assert.deepEqual(json['@context'], CONTEXT)

    assert.equal(json['type'], 'Collection')
    assert.equal(json['totalItems'], 0)
    assert.deepEqual(json['items'], [])
    assert.equal(json['id'], 'https://fires.test/labels')
    assert.equal(json['summary'], 'Labels from https://fires.test/')
  })

  test('correctly negotiates with JSON-LD', async ({ assert }) => {
    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request.get('/labels').headers({ accept: 'application/ld+json' }).end()

    assert.equal(response.statusCode, 200)
    assert.equal(response.headers['content-type'], 'application/ld+json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(json['@context'], CONTEXT)
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

test.group('Controllers / labels', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
  })

  test('when a label is deprecated, it returns owl:deprecated true', async ({ assert }) => {
    const label = await LabelFactory.apply('deprecated').create()

    try {
      const server = await createServer()
      const request = createRequestInjection(server)

      const response = await request
        .get(`/labels/${label.id}`)
        .headers({ accept: 'application/json' })
        .end()

      assert.equal(response.statusCode, 200)

      const json = response.json()

      assert.equal(json['owl:deprecated'], true)
    } finally {
      // fixme: for some reason the database isn't being truncated
      await label.delete()
    }
  })

  test('when a label is not deprecated, it does not return owl:deprecated', async ({ assert }) => {
    const label = await LabelFactory.create()

    try {
      const server = await createServer()
      const request = createRequestInjection(server)

      const response = await request
        .get(`/labels/${label.id}`)
        .headers({ accept: 'application/json' })
        .end()

      assert.equal(response.statusCode, 200)

      const json = response.json()

      assert.notDeepInclude(json, ['owl:deprecated'])
    } finally {
      // fixme: for some reason the database isn't being truncated
      await label.delete()
    }
  })
})
