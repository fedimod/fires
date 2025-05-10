---
"@fedimod/fires-server": patch
---

Refactor: Improve request tests

This switches us to use the japa plugin approach for request tests, injecting a `assertResponse` and `request` values into `TestContext`, which does the `createServer` / `createRequestInjection` logic automatically. In the future this plugin will be extracted into a stand-alone japa plugin for doing fast request testing.

Also ensures the database is correctly setup before tests.
