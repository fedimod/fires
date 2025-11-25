import { test } from '@japa/runner'

import Label from '#models/label'
import { LabelFactory } from '#database/factories/label_factory'
import { XSDDateFormat, JSON_LD_CONTEXT } from '#utils/jsonld'

test.group('Controllers / labels / content negotiation', (group) => {
  group.each.teardown(async () => {
    await Label.query().delete()
  })

  test('correctly negotiates to JSON', async ({ assert, assertResponse, request }) => {
    const response = await request.get('/labels').headers({ accept: 'application/json' }).end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(json['@context'], JSON_LD_CONTEXT)

    assert.equal(json['type'], 'Collection')
    assert.equal(json['totalItems'], 0)
    assert.deepEqual(json['items'], [])
    assert.equal(json['id'], 'https://fires.test/labels')
    assert.equal(json['url'], 'https://fires.test/labels')
    assert.equal(json['summary'], 'Labels from https://fires.test/')
  })

  test('correctly negotiates with JSON-LD', async ({ assert, assertResponse, request }) => {
    const response = await request.get('/labels').headers({ accept: 'application/ld+json' }).end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/ld+json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(json['@context'], JSON_LD_CONTEXT)
  })

  test('correctly negotiates to HTML', async ({ assertResponse, request }) => {
    const response = await request.get('/labels').headers({ accept: 'text/html' }).end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'text/html; charset=utf-8')
  })

  test('defaults to HTML when no Accept header is present', async ({ assertResponse, request }) => {
    const response = await request.get('/labels').end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'text/html; charset=utf-8')
  })

  test('correctly negotiates an individual label to HTML, redirecting to the canonical URL', async ({
    assertResponse,
    request,
  }) => {
    const label = await LabelFactory.create()
    const response = await request.get(`/labels/${label.id}`).headers({ accept: 'text/html' }).end()

    assertResponse.status(response, 302)
    assertResponse.header(response, 'Location', `/labels/${label.slug}`)
  })

  test('correctly negotiates an individual label to JSON', async ({
    assert,
    assertResponse,
    request,
  }) => {
    const label = await LabelFactory.create()
    const response = await request
      .get(`/labels/${label.id}`)
      .headers({ accept: 'application/ld+json' })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/ld+json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(json['@context'], JSON_LD_CONTEXT)
    assert.equal(json.type, 'fires:Label')
    assert.equal(json.id, `https://fires.test/labels/${label.id}`)
    assert.equal(json.url, `https://fires.test/labels/${label.slug}`)
    assert.equal(json.name, label.name)
    assert.equal(json.summary, label.summary)
  })

  test('correctly negotiates an individual label to JSON when requesting with the slug, redirecting to the canonical URL', async ({
    assertResponse,
    request,
  }) => {
    const label = await LabelFactory.create()
    const response = await request
      .get(`/labels/${label.slug}`)
      .headers({ accept: 'application/ld+json' })
      .end()

    assertResponse.status(response, 302)
    assertResponse.header(response, 'Location', `/labels/${label.id}`)
  })
})

test.group('Controllers / labels', (group) => {
  group.each.teardown(async () => {
    await Label.query().delete()
  })

  test('fetching the collection of labels', async ({ assert, assertResponse, request }) => {
    const label = await LabelFactory.create()

    const response = await request.get(`/labels`).headers({ accept: 'application/json' }).end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    assert.equal(json['type'], 'Collection')
    assert.equal(json.totalItems, 1)
    assert.equal(json.updated, label.updatedAt.toFormat(XSDDateFormat))
    assert.equal(json.items[0]['type'], 'fires:Label')
    assert.equal(json.items[0].name, label.name)
    assert.equal(json.items[0].summary, label.summary)
    assert.equal(json.items[0].published, label.createdAt.toFormat(XSDDateFormat))
    assert.equal(json.items[0].updated, label.updatedAt.toFormat(XSDDateFormat))
    assert.notDeepInclude(json.items[0], ['deprecated'])
  })

  test('fetching an individual label', async ({ assert, assertResponse, request }) => {
    const label = await LabelFactory.create()

    const response = await request
      .get(`/labels/${label.id}`)
      .headers({ accept: 'application/json' })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(json['@context'], JSON_LD_CONTEXT)
    assert.equal(json['type'], 'fires:Label')
    assert.equal(json.name, label.name)
    assert.equal(json.summary, label.summary)
  })

  test('fetching an individual label as json-ld', async ({ assert, assertResponse, request }) => {
    const label = await LabelFactory.create()

    const response = await request
      .get(`/labels/${label.id}`)
      .headers({ accept: 'application/ld+json' })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/ld+json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(json['@context'], JSON_LD_CONTEXT)
    assert.equal(json['type'], 'fires:Label')
    assert.equal(json.name, label.name)
    assert.equal(json.summary, label.summary)
  })

  test('fetching the collection of labels with json-ld profile', async ({
    assert,
    assertResponse,
    request,
  }) => {
    const label = await LabelFactory.create()

    const response = await request
      .get(`/labels`)
      .headers({ accept: 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"' })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/ld+json; charset=utf-8')

    const json = response.json()

    assert.equal(json['type'], 'Collection')
    assert.equal(json.totalItems, 1)
    assert.equal(json.updated, label.updatedAt.toFormat(XSDDateFormat))
    assert.equal(json.items[0]['type'], 'fires:Label')
    assert.equal(json.items[0].name, label.name)
    assert.equal(json.items[0].summary, label.summary)
    assert.equal(json.items[0].published, label.createdAt.toFormat(XSDDateFormat))
    assert.equal(json.items[0].updated, label.updatedAt.toFormat(XSDDateFormat))
    assert.notDeepInclude(json.items[0], ['deprecated'])
  })

  test('fetching an individual label as html', async ({ assert, assertResponse, request }) => {
    const label = await LabelFactory.create()

    const response = await request
      .get(`/labels/${label.slug}`)
      .headers({ accept: 'text/html' })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'text/html; charset=utf-8')

    assert.ok(response.body.includes(label.name), 'Should contain the label name on the page')
  })

  test('when a label is deprecated, it returns owl:deprecated true', async ({
    assert,
    assertResponse,
    request,
  }) => {
    const label = await LabelFactory.apply('deprecated').create()

    const response = await request
      .get(`/labels/${label.id}`)
      .headers({ accept: 'application/json' })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    assert.equal(json['deprecated'], true)
  })
})
