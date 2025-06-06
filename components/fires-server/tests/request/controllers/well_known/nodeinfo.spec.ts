import { test } from '@japa/runner'
import { NodeInfo, NodeInfoDiscovery } from '#controllers/well-known/nodeinfo_controller'

test.group('Controllers / nodeinfo', () => {
  test('GET /.well-known/nodeinfo returns JSON document pointing to nodeinfo', async ({
    assert,
    assertResponse,
    request,
  }) => {
    const response = await request.get('/.well-known/nodeinfo').end()

    assertResponse.status(response, 200)
    assertResponse.contentType(response, 'application/json; charset=utf-8')

    const json = response.json<NodeInfoDiscovery>()

    assert.isObject(json)
    assert.isArray(json.links)
    assert.includeDeepMembers(json.links, [
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1',
        href: 'https://fires.test/nodeinfo/2.1',
      },
    ])
  })

  test('GET /nodeinfo/2.1 endpoint returns JSON with nodeinfo properties', async ({
    assert,
    assertResponse,
    request,
  }) => {
    const response = await request.get('/nodeinfo/2.1').end()

    assertResponse.status(response, 200)
    assertResponse.contentType(
      response,
      'application/json; profile="http://nodeinfo.diaspora.software/ns/schema/2.1#"'
    )

    const json = response.json<NodeInfo>()

    assert.isObject(json)
    assert.sameMembers(Object.keys(json), [
      'version',
      'software',
      'protocols',
      'services',
      'openRegistrations',
      'usage',
      'metadata',
    ])
    assert.equal(json.version, '2.1')
    assert.isArray(json.protocols)
    assert.isObject(json.software)
    assert.isString(json.software.name)
    assert.isString(json.software.version)
    assert.isString(json.software.homepage)
    assert.isString(json.software.repository)

    assert.equal(json.openRegistrations, false)

    assert.isObject(json.usage)
    assert.isObject(json.services)
    assert.deepEqual(json.services, {
      inbound: [],
      outbound: [],
    })

    // Ensure software name is valid:
    // per: https://nodeinfo.diaspora.software/schema.html
    assert.match(json.software.name, /^[a-z0-9-]+$/)

    // Non-standard protocol:
    assert.includeMembers(json.protocols, ['fires'])
  })
})
