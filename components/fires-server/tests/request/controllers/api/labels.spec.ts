import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

import { createRequestInjection, createServer } from '#tests/helpers/http_injection_test'
import { LabelFactory } from '#database/factories/label_factory'
import Label from '#models/label'
import { faker } from '@faker-js/faker'

test.group('Controllers / api / labels', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.each.teardown(async () => {
    await Label.query().delete()
  })

  test('creates a label', async ({ assert }) => {
    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request
      .post('/api/labels')
      .body({
        name: 'Test Label',
      })
      .headers({ accept: 'application/json' })
      .end()

    assert.equal(response.statusCode, 200)
    assert.equal(response.headers['content-type'], 'application/json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(Object.keys(json), ['name', 'language', 'id', 'createdAt', 'updatedAt'])
  })

  test('updating a label with a new name', async ({ assert }) => {
    const newName = faker.word.sample(2)
    const label = await LabelFactory.create()

    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request
      .patch(`/api/labels/${label.id}`)
      .body({
        name: newName,
      })
      .headers({ accept: 'application/json' })
      .end()

    const json = response.json()
    const updatedLabel = await Label.findOrFail(label.id)

    assert.equal(response.statusCode, 200)

    assert.equal(updatedLabel.name, newName)
    assert.equal(json.name, newName)
  })

  test('allows updating a label with the same name', async ({ assert }) => {
    const label = await LabelFactory.merge({ name: 'Test Label' }).create()

    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request
      .patch(`/api/labels/${label.id}`)
      .body({
        name: 'Test Label',
        summary: 'Test Summary',
      })
      .headers({ accept: 'application/json' })
      .end()

    assert.equal(response.statusCode, 200)

    const json = response.json()

    assert.equal(json.name, 'Test Label')
    assert.equal(json.summary, 'Test Summary')
  })

  test('prevent updating a label with a conflicting name', async ({ assert }) => {
    await LabelFactory.merge({ name: 'Existing Label' }).create()

    const label = await LabelFactory.merge({ name: 'Test Label' }).create()

    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request
      .patch(`/api/labels/${label.id}`)
      .body({
        name: 'Existing Label',
      })
      .headers({ accept: 'application/json' })
      .end()

    assert.equal(response.statusCode, 422)

    const json = response.json()

    assert.deepPropertyVal(json, 'errors[0].field', 'name')
    assert.deepPropertyVal(json, 'errors[0].rule', 'database.unique')
  })

  test('deprecating a label', async ({ assert }) => {
    const label = await LabelFactory.merge({ name: 'Existing Label' }).create()

    const server = await createServer()
    const request = createRequestInjection(server)

    assert.equal(label.deprecatedAt, null)

    const response = await request
      .delete(`/api/labels/${label.id}`)
      .headers({ accept: 'application/json' })
      .end()

    assert.equal(response.statusCode, 200)

    const json = response.json()

    await label.refresh()
    assert.notEqual(label.deprecatedAt, null)
    assert.notEqual(json.deprecatedAt, null)
  })

  test('deleting a label, bypassing deprecation', async ({ assert }) => {
    const label = await LabelFactory.merge({ name: 'Existing Label' }).create()

    const server = await createServer()
    const request = createRequestInjection(server)

    const response = await request
      .delete(`/api/labels/${label.id}?force=true`)
      .headers({ accept: 'application/json' })
      .end()

    assert.equal(response.statusCode, 204)

    // Cannot reload the label because it's been deleted from the database:
    assert.rejects(async () => {
      await label.refresh()
    })
  })
})
