# @fedimod/fires-docs

## 1.2.0

### Minor Changes

- [#137](https://github.com/fedimod/fires/pull/137) [`97bded9`](https://github.com/fedimod/fires/commit/97bded9edac4fd41568e45d374d36d2777228627) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Improve documentation

  - Split the API and Data Model sections to make the documentation for Labels clearer
  - Improved redirect handling
  - Fixed incorrect page links
  - Fixed missing page titles result in the titles of pages being confusing

## 1.1.1

### Patch Changes

- [#131](https://github.com/fedimod/fires/pull/131) [`2be4c9b`](https://github.com/fedimod/fires/commit/2be4c9b9adec367d30132c54b8818b557c6aac02) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Improve documentation for Labels

- [#131](https://github.com/fedimod/fires/pull/131) [`d2823c4`](https://github.com/fedimod/fires/commit/d2823c4be9683d560743510dc2370a6e20745975) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add automatic running of migrations on server startup

  By setting the `DATABASE_AUTOMIGRATE` environment variable to `true`, you can now have the container for the FIRES reference server automatically run the migrations on startup if necessary. This can make deployment simpler in some cases.

## 1.1.0

### Minor Changes

- [#64](https://github.com/fedimod/fires/pull/64) [`81ebb83`](https://github.com/fedimod/fires/commit/81ebb830e3aecacbc36b8e96f6a3e75e03c97c37) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Implemented Labels API

  This provides a new set of APIs to the FIRES reference server, as well as documenting the API of the Labels endpoint(s) in the FIRES protocol.

  The FIRES protocol covers reading the collection of all labels and retrieving an individual label as both `text/html` and `application/json` or `application/ld+json`.

  The non-standard API for managing labels covers creating, updated, deprecating and deleting labels from the FIRES reference server.

### Patch Changes

- [#46](https://github.com/fedimod/fires/pull/46) [`02f2b07`](https://github.com/fedimod/fires/commit/02f2b07da20a218ee4bf3dd396547b21135617ea) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Migrate from npm to pnpm for better builds

- [#49](https://github.com/fedimod/fires/pull/49) [`138f798`](https://github.com/fedimod/fires/commit/138f798ed13afdbd4e447f173034a13989d90220) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Remove mermaid diagrams & update to vitepress 2.0.0-alpha.3
