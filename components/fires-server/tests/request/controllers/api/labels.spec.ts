import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import type { HttpMethod } from '#tests/plugins/request_tests'

import { LabelFactory } from '#database/factories/label_factory'
import Label from '#models/label'
import AccessToken from '#models/access_token'
import { getAuthorizationHeader, createToken } from '#tests/helpers/http_authorization'

test.group('Controllers / api / labels', (group) => {
  let token: AccessToken
  group.setup(async () => {
    token = await createToken(['read', 'write', 'admin'])
  })
  group.each.teardown(async () => {
    await Label.query().delete()
  })

  test('requires authentication', async ({ assertResponse, request }) => {
    const response = await request
      .get('/api/labels')
      .headers({
        accept: 'application/json',
      })
      .end()

    assertResponse.status(response, 401)
    assertResponse.challenge(response, {
      realm: 'FIRES',
      scheme: 'Bearer',
    })
  })

  test('requires authentication using token with read or admin abilities')
    .with<{ method: HttpMethod; endpoint: string }[]>([
      { method: 'get', endpoint: '/api/labels' },
      { method: 'post', endpoint: '/api/labels' },
      { method: 'patch', endpoint: '/api/labels/c21450ca-8dd2-4211-b802-57937b772b20' },
      { method: 'delete', endpoint: '/api/labels/c21450ca-8dd2-4211-b802-57937b772b20' },
    ])
    .run(async ({ assertResponse, request }, { method, endpoint }) => {
      const writeOnlyToken = await createToken(['write'])

      const response = await request
        .any(method, endpoint)
        .headers({
          accept: 'application/json',
          authorization: getAuthorizationHeader(writeOnlyToken),
        })
        .end()

      assertResponse.status(response, 401)
      assertResponse.challenge(response, {
        scheme: 'Bearer',
        realm: 'FIRES',
        params: {
          error: 'insufficient_scope',
        },
      })
    })

  test('lists labels', async ({ assert, assertResponse, request }) => {
    const labels = await LabelFactory.createMany(2)

    const response = await request
      .get('/api/labels')
      .headers({
        accept: 'application/json',
        authorization: getAuthorizationHeader(token),
      })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    assert.typeOf(json.items, 'array')
    assert.lengthOf(json.items, 2)
    assert.containsSubset(
      json.items,
      labels.map((label) => ({
        id: label.id,
      }))
    )
  })

  test('creates a label', async ({ assert, assertResponse, request }) => {
    const response = await request
      .post('/api/labels')
      .body({
        name: 'Test Label',
      })
      .headers({
        accept: 'application/json',
        authorization: getAuthorizationHeader(token),
      })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(Object.keys(json), ['name', 'locale', 'id', 'slug', 'createdAt', 'updatedAt'])
  })

  test('updating a label with a new name', async ({ assert, assertResponse, request }) => {
    const newName = faker.word.sample(2)
    const label = await LabelFactory.create()

    const response = await request
      .patch(`/api/labels/${label.id}`)
      .body({
        name: newName,
      })
      .headers({
        accept: 'application/json',
        authorization: getAuthorizationHeader(token),
      })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()
    const updatedLabel = await Label.findOrFail(label.id)

    assert.equal(updatedLabel.name, newName)
    assert.equal(json.name, newName)
  })

  test('allows updating a label with the same name', async ({
    assert,
    assertResponse,
    request,
  }) => {
    const label = await LabelFactory.merge({ name: 'Test Label' }).create()

    const response = await request
      .patch(`/api/labels/${label.id}`)
      .body({
        name: 'Test Label',
        summary: 'Test Summary',
      })
      .headers({
        accept: 'application/json',
        authorization: getAuthorizationHeader(token),
      })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    assert.equal(json.name, 'Test Label')
    assert.equal(json.summary, 'Test Summary')
  })

  test('prevent updating a label with a conflicting name', async ({
    assert,
    assertResponse,
    request,
  }) => {
    await LabelFactory.merge({ name: 'Existing Label' }).create()

    const label = await LabelFactory.merge({ name: 'Test Label' }).create()

    const response = await request
      .patch(`/api/labels/${label.id}`)
      .body({
        name: 'Existing Label',
      })
      .headers({
        accept: 'application/json',
        authorization: getAuthorizationHeader(token),
      })
      .end()

    assertResponse.status(response, 422)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    assert.deepPropertyVal(json, 'errors[0].field', 'name')
    assert.deepPropertyVal(json, 'errors[0].rule', 'database.unique')
  })

  test('deprecating a label', async ({ assert, assertResponse, request }) => {
    const label = await LabelFactory.merge({ name: 'Existing Label' }).create()

    assert.equal(label.deprecatedAt, null)

    const response = await request
      .delete(`/api/labels/${label.id}`)
      .headers({
        accept: 'application/json',
        authorization: getAuthorizationHeader(token),
      })
      .end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    await label.refresh()
    assert.notEqual(label.deprecatedAt, null)
    assert.notEqual(json.deprecatedAt, null)
  })

  test('deleting a label, bypassing deprecation', async ({ assert, assertResponse, request }) => {
    const label = await LabelFactory.merge({ name: 'Existing Label' }).create()

    const response = await request
      .delete(`/api/labels/${label.id}?force=true`)
      .headers({
        accept: 'application/json',
        authorization: getAuthorizationHeader(token),
      })
      .end()

    assertResponse.status(response, 204)

    // Cannot reload the label because it's been deleted from the database:
    assert.rejects(async () => {
      await label.refresh()
    })
  })
})
