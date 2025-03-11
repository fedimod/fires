import type { PluginFn } from '@japa/runner/types'
import type { Assert } from '@japa/assert'
import { TestContext } from '@japa/runner/core'
import { ApplicationService } from '@adonisjs/core/types'
import inject from 'light-my-request'

// These come from light-my-request:
export type HttpMethod = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace'
type RequestMethods = Record<HttpMethod, (url: string) => inject.Chain> &
  Record<'any', (method: HttpMethod, url: string) => inject.Chain>

type ExpectedChallenge = {
  realm: string
  scheme: string
  params?: Record<string, string>
}

class ResponseAssertions {
  private assert: Assert

  constructor(_options: {}, assert: Assert) {
    this.assert = assert
  }

  status(response: inject.Response, expectedStatus: number) {
    this.assert.equal(response.statusCode, expectedStatus)
  }

  contentType(response: inject.Response, expectedContentType: string) {
    this.assert.include(response.headers, { 'content-type': expectedContentType })
  }

  header(response: inject.Response, name: string, value?: string) {
    const header = name.toLowerCase()
    this.assert.property(response.headers, header)

    if (value !== undefined) {
      this.assert.include(response.headers, { [header]: value })
    }
  }

  challenge(response: inject.Response, expectedChallenge: ExpectedChallenge) {
    const challenge =
      (Array.isArray(response.headers['www-authenticate'])
        ? response.headers['www-authenticate'][0]
        : response.headers['www-authenticate']) ?? ''

    this.assert.ok(
      challenge.startsWith(`${expectedChallenge.scheme} `),
      'Challenge contains correct auth scheme'
    )

    if (typeof expectedChallenge.params === 'object') {
      const challengeParams = challenge
        .slice(expectedChallenge.scheme.length + 1)
        .split(/,\s+/)
        .reduce<Record<string, string>>((acc, param) => {
          const [name, value] = param.split('=', 2)
          acc[name] = JSON.parse(value)

          return acc
        }, {})

      this.assert.include(challengeParams, expectedChallenge.params)
    }
  }
}

/**
 * API client plugin registers an HTTP request client that
 * can be used for testing API endpoints.
 */
export function requestTests(app: ApplicationService): PluginFn {
  return async function () {
    const server = await app.container.make('server')
    await server.boot()

    const requestHandler = server.handle.bind(server)

    TestContext.getter(
      'request',
      function (this: TestContext) {
        return {
          any(method: HttpMethod, url: string) {
            return inject(requestHandler)[method](url)
          },
          get(url: string) {
            return inject(requestHandler).get(url)
          },
          post(url: string) {
            return inject(requestHandler).post(url)
          },
          put(url: string) {
            return inject(requestHandler).put(url)
          },
          patch(url: string) {
            return inject(requestHandler).patch(url)
          },
          delete(url: string) {
            return inject(requestHandler).delete(url)
          },
          trace(url: string) {
            return inject(requestHandler).trace(url)
          },
          options(url: string) {
            return inject(requestHandler).options(url)
          },
          head(url: string) {
            return inject(requestHandler).head(url)
          },
        }
      },
      true
    )

    TestContext.getter(
      'assertResponse',
      function (this: TestContext) {
        return new ResponseAssertions({}, this.assert)
      },
      true
    )
  }
}

declare module '@japa/runner/core' {
  interface TestContext {
    request: RequestMethods
    assertResponse: ResponseAssertions
  }
}
