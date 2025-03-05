# @fedimod/fires-server

## 0.1.0

### Minor Changes

- [#36](https://github.com/fedimod/fires/pull/36) [`791d620`](https://github.com/fedimod/fires/commit/791d6206fb6a8bfa1e79c02952a3e5b71d36c636) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Bootstrap fires-server component

  - Sets up an adonis.js application with postgresql, lucid, vite, edge.js, and pico.css
  - Adds database configuration for using SSL CA Certificates (needed for people to deploy with providers like DigitalOcean's Managed Databases)
  - Disables multipart/form-data requests, as the FIRES server doesn't need to handle these, but there's no way to disable them in Adonis.js yet. See: https://github.com/adonisjs/bodyparser/pull/66

### Patch Changes

- [#46](https://github.com/fedimod/fires/pull/46) [`02f2b07`](https://github.com/fedimod/fires/commit/02f2b07da20a218ee4bf3dd396547b21135617ea) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Migrate from npm to pnpm for better builds

- [#50](https://github.com/fedimod/fires/pull/50) [`647e6af`](https://github.com/fedimod/fires/commit/647e6af2c551214855c0c617e30202a2900ad62e) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add required PUBLIC_URL environment variable

- [#52](https://github.com/fedimod/fires/pull/52) [`56c8d47`](https://github.com/fedimod/fires/commit/56c8d479e652f24b58c3d610ff18f6ddfd6968f5) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix docker image labels, these weren't working correctly on edge images

- [#47](https://github.com/fedimod/fires/pull/47) [`9455ab7`](https://github.com/fedimod/fires/commit/9455ab7b8682bd3f4e73a95d8ff5f78ec9b7720f) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add docker images to deployments

  We're now building both amd64 and arm64 docker images for fires-server.

- [#51](https://github.com/fedimod/fires/pull/51) [`e65304b`](https://github.com/fedimod/fires/commit/e65304be1f705326c496435904ef321a0361f0aa) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add localisation support
