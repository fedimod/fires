import { test } from '@japa/runner'

test.group('health check route', () => {
  test('responds with ok', async ({ assert, assertResponse, request }) => {
    const response = await request.get('/health').end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json()

    assert.deepEqual(json, { ok: true })
  })
})
