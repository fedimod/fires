import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

import { createRequestInjection, createServer } from '#tests/helpers/http_injection_test'
import { LabelFactory } from '#database/factories/label_factory'
import { CONTEXT } from '#serializers/labels_serializer'
import Label from '#models/label'
import { XSDDateFormat } from '#utils/jsonld'

test.group('Controllers / labels / content negotiation', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
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

  group.each.teardown(async () => {
    await Label.query().delete()
  })

  test('fetching the collection of labels', async ({ assert }) => {
    const label = await LabelFactory.create()

    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request.get(`/labels`).headers({ accept: 'application/json' }).end()

    assert.equal(response.statusCode, 200)

    const json = response.json()

    assert.equal(json['type'], 'Collection')
    assert.equal(json.totalItems, 1)
    assert.equal(json.updated, label.updatedAt.toFormat(XSDDateFormat))
    assert.equal(json.items[0]['type'], 'Label')
    assert.equal(json.items[0].name, label.name)
    assert.equal(json.items[0].summary, label.summary)
    assert.equal(json.items[0].published, label.createdAt.toFormat(XSDDateFormat))
    assert.equal(json.items[0].updated, label.updatedAt.toFormat(XSDDateFormat))
    assert.notDeepInclude(json.items[0], ['owl:deprecated'])
  })

  test('fetching an individual label', async ({ assert }) => {
    const label = await LabelFactory.create()

    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request
      .get(`/labels/${label.id}`)
      .headers({ accept: 'application/json' })
      .end()

    assert.equal(response.statusCode, 200)

    const json = response.json()

    assert.deepEqual(json['@context'], CONTEXT)
    assert.equal(json['type'], 'Label')
    assert.equal(json.name, label.name)
    assert.equal(json.summary, label.summary)
  })

  test('when a label is deprecated, it returns owl:deprecated true', async ({ assert }) => {
    const label = await LabelFactory.apply('deprecated').create()

    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request
      .get(`/labels/${label.id}`)
      .headers({ accept: 'application/json' })
      .end()

    assert.equal(response.statusCode, 200)

    const json = response.json()

    assert.equal(json['owl:deprecated'], true)
  })
})
