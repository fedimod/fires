import { test } from '@japa/runner'
import { createMiddlewareInjectionTest } from '#tests/helpers/http_injection_test'

import DisableMultipartRequestsMiddleware from '#middleware/disable_multipart_requests_middleware'

test.group('Middleware / Disable multipart requests', () => {
  test('returns http bad request for multipart requests', async ({ assert }) => {
    let nextCalled = false

    const request = createMiddlewareInjectionTest(async (ctx) => {
      const middleware = new DisableMultipartRequestsMiddleware()

      nextCalled = false
      await middleware.handle(ctx, () => {
        nextCalled = true
      })
    })

    const response = await request
      .post('/')
      .headers({ 'content-type': 'multipart/form-data' })
      .payload({ test: 'payload' })
      .end()

    assert.equal(nextCalled, false)
    assert.equal(response.statusCode, 400)
    assert.deepEqual(response.json(), {
      error: 'Bad request',
    })
  })

  test('passes through requests that are not multipart', async ({ assert }) => {
    let nextCalled = false

    const request = createMiddlewareInjectionTest(async (ctx) => {
      const middleware = new DisableMultipartRequestsMiddleware()

      nextCalled = false
      await middleware.handle(ctx, () => {
        nextCalled = true
      })
    })

    const response = await request
      .post('/')
      .headers({ 'content-type': 'application/json' })
      .payload({ test: 'payload' })
      .end()

    assert.equal(nextCalled, true)
    assert.equal(response.statusCode, 204)
  })
})
