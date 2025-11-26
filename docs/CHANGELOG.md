# @fedimod/fires-docs

## 1.5.0

### Minor Changes

- [#236](https://github.com/fedimod/fires/pull/236) [`768ae0d`](https://github.com/fedimod/fires/commit/768ae0d77f29ee5ec71a596b3e9b44b29892233c) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Revise JSON-LD Responses

  This changes the JSON-LD responses for the labels and changes. For labels, the `type` changes to `fires:Label` to allow upgrade to the `Label` type being defined by the [ActivityPub Trust & Safety Taskforce](https://github.com/swicg/activitypub-trust-and-safety/issues/84), additionally `owl:deprecated` is now just `deprecated` and included in the FIRES JSON-LD context.

  Normalized `entity_kind`, `entity_key`, `recommended_policy` and `recommended_filters` to camalCase, per JSON-LD Best Practices.

  The changes within a dataset now have some more rules around their output:
  - `Retraction` will only include the `entityKind` and `entityKey` properties, besides the core properties of `id`, `type` and `published`, and in the future a `comment`. They won't include `labels`, `recommendedPolicy` or `recommendedFilters`, since those no longer apply as of the retraction.
  - `Tombstone` will only include the `id`, `type` and `published` properties (currently unused in the reference server).
  - `Advisory` will have the properties `id`, `type`, `published`, `entityKind`, `entityKey`, `labels`.
  - `Recommendation` will have all the properties of `Advisory`, and additionally `recommendedPolicy` and `recommendedFilters`

  Also fixed is the IRI of the `fires` property in the JSON-LD context. Previously it was `https://fires.fedimod.org/ns#` and now it is `https://fires.fedimod.org/context/fires.jsonld#`

- [#243](https://github.com/fedimod/fires/pull/243) [`bf33e64`](https://github.com/fedimod/fires/commit/bf33e647d38b1128a76d9c11231bc323940ed14c) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add deployment documentation for the reference server

  This also fixes a few minor issues in the automated installer script.

## 1.4.0

### Minor Changes

- [#202](https://github.com/fedimod/fires/pull/202) [`9b622a7`](https://github.com/fedimod/fires/commit/9b622a7a5de0087ad6e3f8230417463ea5440743) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Implement CSV Imports for Datasets

  This implements the ability to import data into a FIRES server from existing domain block CSV files.

  What's not implemented during imports is labelling data, since there's simply no way to fit it into the current admin panel design (I'm toying with a redesign). Originally I tried to detect the labels from the public comment, but it just didn't make much sense.

## 1.3.1

### Patch Changes

- [#172](https://github.com/fedimod/fires/pull/172) [`1f2cceb`](https://github.com/fedimod/fires/commit/1f2ccebedabd848d612c47f2f1c8ab43efecb59a) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix JSON-LD context as GitHub Pages can't handle the redirect correctly

## 1.3.0

### Minor Changes

- [#167](https://github.com/fedimod/fires/pull/167) [`88d1afc`](https://github.com/fedimod/fires/commit/88d1afc8830b011dc7ce828eafe84dc90301d54c) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Implement Datasets with changes and snapshots

  This marks the first time FIRES has been "fully functional" in that you can now create Datasets, store changes in them, and retrieve those changes via a JSON-LD API which is self-discoverable.

  So for any given FIRES server, you can request GET /nodeinfo/2.1 which will contain points to the labels and datasets collections, from there for a given dataset, you can discover it's metadata (name, summary, description) and then access it's changes and snapshot which are collections of records.

  The snapshot for a dataset is the latest change for any record within that dataset, where records are identified by their entity_kind and entity_key, so if you have 5 changes for the same record, the snapshot will include one item which is the latest value for that pair. This enables efficiently pulling in the latest copy of the dataset when you don't care about the history.

  If you want the full history, you can follow the changes from the first page onward, once you reach a OrderedCollectionPage that doesn't have a next property, you can store the id of that page as your marker as to where to fetch from the next time you want to synchronise data.

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
