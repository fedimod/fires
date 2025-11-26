# @fedimod/fires-server

## 0.7.0

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

### Patch Changes

- [#243](https://github.com/fedimod/fires/pull/243) [`bf33e64`](https://github.com/fedimod/fires/commit/bf33e647d38b1128a76d9c11231bc323940ed14c) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add deployment documentation for the reference server

  This also fixes a few minor issues in the automated installer script.

- [#239](https://github.com/fedimod/fires/pull/239) [`78d026a`](https://github.com/fedimod/fires/commit/78d026a01b709764c16eb611fb884fe856d906c2) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add rate limiting for all endpoints

  The rate-limits are per IP address. For dataset exports, they are per dataset per IP and fairly low, since this endpoint is quite expensive. For login, the rate limits are by IP and User.

- [#233](https://github.com/fedimod/fires/pull/233) [`f5d2a8c`](https://github.com/fedimod/fires/commit/f5d2a8c8453aaa7a1d702e171cac9039b47fdca6) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix issue with watchtower not actually automatically updating

- [#238](https://github.com/fedimod/fires/pull/238) [`5cc5597`](https://github.com/fedimod/fires/commit/5cc5597609afa08fe40ab7e0da36c2a0ddee3766) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix content negotiation when using profiles with JSON-LD

- [#243](https://github.com/fedimod/fires/pull/243) [`99ca129`](https://github.com/fedimod/fires/commit/99ca1290748b3be10fa2d4974c9f1e00cc888e48) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Rework fires:setup command to align with the settings page.

- [#241](https://github.com/fedimod/fires/pull/241) [`030978f`](https://github.com/fedimod/fires/commit/030978f21d5b91eb0cb0e3fd149def3e4e51ccb2) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix docker-compose postgresql data directory

## 0.6.2

### Patch Changes

- [#225](https://github.com/fedimod/fires/pull/225) [`02f0819`](https://github.com/fedimod/fires/commit/02f0819bb7632312350e17455aa2e2d0269dcba9) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Increase page size for dataset changes API

## 0.6.1

### Patch Changes

- [#222](https://github.com/fedimod/fires/pull/222) [`a88a448`](https://github.com/fedimod/fires/commit/a88a4487f524a15ac55be0e09fa573cc68939546) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix asset building for client-side javascript

## 0.6.0

### Minor Changes

- [#220](https://github.com/fedimod/fires/pull/220) [`a53f751`](https://github.com/fedimod/fires/commit/a53f75149d3b23a73dc1cfccd1d2bc5f16e584b2) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Implement exports of the Dataset snapshot in Mastodon compatible CSV files

- [#221](https://github.com/fedimod/fires/pull/221) [`7352765`](https://github.com/fedimod/fires/commit/7352765e9198f50cd04ef6e035294b37f5705e6e) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add installer script for fires-server

### Patch Changes

- [#214](https://github.com/fedimod/fires/pull/214) [`dc66176`](https://github.com/fedimod/fires/commit/dc66176ca042023457cd4b569283ff31a84eb986) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix docker-compose postgresql data directory for postgresql 18

## 0.5.0

### Minor Changes

- [#202](https://github.com/fedimod/fires/pull/202) [`9b622a7`](https://github.com/fedimod/fires/commit/9b622a7a5de0087ad6e3f8230417463ea5440743) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Implement CSV Imports for Datasets

  This implements the ability to import data into a FIRES server from existing domain block CSV files.

  What's not implemented during imports is labelling data, since there's simply no way to fit it into the current admin panel design (I'm toying with a redesign). Originally I tried to detect the labels from the public comment, but it just didn't make much sense.

- [#203](https://github.com/fedimod/fires/pull/203) [`662184f`](https://github.com/fedimod/fires/commit/662184fcf4abde7a1caaef15cd082058b634d056) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix error with dataset changes accidentally redirect

  I'd accidentally gotten wrong the UUID format for the genesis (first) dataset change UUID,
  it should have been `00000000-0000-7000-A000-000000000000` not `00000000-0000-7000-0000-000000000000`.

  This caused a validation error to be thrown which resulted in the request being redirected to the homepage.

## 0.4.2

### Patch Changes

- [#174](https://github.com/fedimod/fires/pull/174) [`2cdb27d`](https://github.com/fedimod/fires/commit/2cdb27dec3a04c6233d9de079baf838e4750e83f) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix dockerfile using outdated package version for curl

## 0.4.1

### Patch Changes

- [#172](https://github.com/fedimod/fires/pull/172) [`1f2cceb`](https://github.com/fedimod/fires/commit/1f2ccebedabd848d612c47f2f1c8ab43efecb59a) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix JSON-LD context as GitHub Pages can't handle the redirect correctly

## 0.4.0

### Minor Changes

- [#167](https://github.com/fedimod/fires/pull/167) [`88d1afc`](https://github.com/fedimod/fires/commit/88d1afc8830b011dc7ce828eafe84dc90301d54c) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Implement Datasets with changes and snapshots

  This marks the first time FIRES has been "fully functional" in that you can now create Datasets, store changes in them, and retrieve those changes via a JSON-LD API which is self-discoverable.

  So for any given FIRES server, you can request GET /nodeinfo/2.1 which will contain points to the labels and datasets collections, from there for a given dataset, you can discover it's metadata (name, summary, description) and then access it's changes and snapshot which are collections of records.

  The snapshot for a dataset is the latest change for any record within that dataset, where records are identified by their entity_kind and entity_key, so if you have 5 changes for the same record, the snapshot will include one item which is the latest value for that pair. This enables efficiently pulling in the latest copy of the dataset when you don't care about the history.

  If you want the full history, you can follow the changes from the first page onward, once you reach a OrderedCollectionPage that doesn't have a next property, you can store the id of that page as your marker as to where to fetch from the next time you want to synchronise data.

### Patch Changes

- [#162](https://github.com/fedimod/fires/pull/162) [`f42c1d3`](https://github.com/fedimod/fires/commit/f42c1d32402f31608fc8a5650117bc2eafe17ef8) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add caching for view metadata and settings

- [#162](https://github.com/fedimod/fires/pull/162) [`0b4745e`](https://github.com/fedimod/fires/commit/0b4745e2148c4666d24d1d2cce836d9e50986514) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add indicator for external links

## 0.3.3

### Patch Changes

- [#160](https://github.com/fedimod/fires/pull/160) [`05b6d27`](https://github.com/fedimod/fires/commit/05b6d2771014bd0b8ad85c365c793beae381eac4) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Implement deprecation of labels in Admin UI and Web UI

- [#160](https://github.com/fedimod/fires/pull/160) [`4a55522`](https://github.com/fedimod/fires/commit/4a55522668f01673b671e3a09bb83ec399338e74) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix bug when updating a label and adding more translations

- [#160](https://github.com/fedimod/fires/pull/160) [`bba8136`](https://github.com/fedimod/fires/commit/bba813607fd0f74fc18d2fa7fdcf9d571a42e49b) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add display of number of translations for each label in the Admin UI

- [#160](https://github.com/fedimod/fires/pull/160) [`33027fa`](https://github.com/fedimod/fires/commit/33027fa2bed014fee245f0ca2fdb99df66f292e1) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Update database seeders to create an Admin user and some label translations

## 0.3.2

### Patch Changes

- [#153](https://github.com/fedimod/fires/pull/153) [`ebdb026`](https://github.com/fedimod/fires/commit/ebdb02683007e39e43349bc78621424fbe540ae1) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix error with missing locale when creating a label

  It turns out a disabled form field does not actually submit the value that is selected when the form is submitted, as such that hidden input for locale that I didn't think I needed was actually needed. I've also changed the controller to handle the locale in a more graceful manner.

## 0.3.1

### Patch Changes

- [#150](https://github.com/fedimod/fires/pull/150) [`a35c76d`](https://github.com/fedimod/fires/commit/a35c76d4dd601fac52f4f0221fb5312d16deb0da) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix bug when attempting to create a new label

  When attempting to create a new label after the addition of translations, an error would be thrown due to trying to load the relationships for an unpersisted model. Additionally, the locale select show incorrect data during this flow.

  Furthermore, when creating a label with translations, those translations were not saved.

- [#150](https://github.com/fedimod/fires/pull/150) [`5f0f68f`](https://github.com/fedimod/fires/commit/5f0f68f9988f9a0d4d837763f177ec2a88c1c3c3) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix creating or updating a label with translations via the API

## 0.3.0

### Minor Changes

- [#144](https://github.com/fedimod/fires/pull/144) [`e7829fb`](https://github.com/fedimod/fires/commit/e7829fb7590d9a4df40535316f06be25fdc860e4) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Improve display of the labels list in the admin panel

- [#147](https://github.com/fedimod/fires/pull/147) [`3f506b8`](https://github.com/fedimod/fires/commit/3f506b8c13d73ed56c331c82d5c630217684939e) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add human-friendly URLs to Labels

  This changeset provides prettier URLs for human visitors, whilst still using the unchanging UUID identifier for use in datasets and machine-readable contexts. Additionally, it adds interlinking between the admin panel and the logged out homepage, and introduces copyable input boxes for the URL/IRIs of labels.

  Note: Changing a labels `name` will result in the URL changing for that label, and currently we don't preserve the previous URL and perform redirects, so this will break visitors.

- [#144](https://github.com/fedimod/fires/pull/144) [`e7829fb`](https://github.com/fedimod/fires/commit/e7829fb7590d9a4df40535316f06be25fdc860e4) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add localisation of Labels

  This adds the ability to translate labels into different languages. The localization is supported both in the JSON-LD responses, and in the administration panel which allows you to view a label in different languages, if it has been localized. The admin panel also supports adding and removing label localizations (though this does require javascript), and the API also supports working with localization of labels (though this is untested).

### Patch Changes

- [#145](https://github.com/fedimod/fires/pull/145) [`b24cfdc`](https://github.com/fedimod/fires/commit/b24cfdc494f0067e25f181ae7c8f76d0c33c6213) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add correct error pages for 404 and 5xx errors

## 0.2.1

### Patch Changes

- [#142](https://github.com/fedimod/fires/pull/142) [`0f67fbd`](https://github.com/fedimod/fires/commit/0f67fbd9099d143e8fccd4074ba6a8e8a4685fe9) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix bugs created due to broken code formatting

  When finishing up the admin panel work, I ran code formatting, and didn't notice that a bunch of the edge.js templates became messed up. This is due to edge.js formatting still being somewhat new and sometimes not handling certain ways of writing code.

## 0.2.0

### Minor Changes

- [#140](https://github.com/fedimod/fires/pull/140) [`d435e3c`](https://github.com/fedimod/fires/commit/d435e3cc488d0fd539e4d4cc95a706cb8a3b057a) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Implement UI for administering the reference server

  Following early user feedback that the API-only approach wasn't easy to use, we've implemented a basic admin panel for the FIRES reference server implementation. This is protected using database backed authentication.

  To create users for access to the admin panel, use the following command:

  ```sh
  $ node ace fires:users:create
  ```

  For docker, you can run this command per the [Running Administrative Commands](https://github.com/fedimod/fires/tree/main/components/fires-server#running-administrative-commands) documentation.

  The UI for server administration allows updating the name, summary, description, appeals and documentation URLs, and setting a contact email (though this is currently not used anywhere). It also allows for the creation and editing of Labels, but not currently the deletion or deprecation of them.

## 0.1.11

### Patch Changes

- [#134](https://github.com/fedimod/fires/pull/134) [`e117a0f`](https://github.com/fedimod/fires/commit/e117a0f0bded92b0e42f41636a39ff6011e76271) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix issue with migrations continuously running for CLI commands

## 0.1.10

### Patch Changes

- [#131](https://github.com/fedimod/fires/pull/131) [`d2823c4`](https://github.com/fedimod/fires/commit/d2823c4be9683d560743510dc2370a6e20745975) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add automatic running of migrations on server startup

  By setting the `DATABASE_AUTOMIGRATE` environment variable to `true`, you can now have the container for the FIRES reference server automatically run the migrations on startup if necessary. This can make deployment simpler in some cases.

- [#132](https://github.com/fedimod/fires/pull/132) [`14e058a`](https://github.com/fedimod/fires/commit/14e058afe5eb4ef34a9069d0acb8236c6218756b) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix bug with Server details being incorrectly displayed

  In some situations, the two settings for the server name and summary were being displayed in the wrong position, e.g., name would appear as summary and summary as name. This turned out to be a bug in how we were fetching the settings back in the middleware that supplies this information to the views.

<details>
  <summary>
    <h2>0.1.1 to 0.1.9</h2>
    Trying to get the release process to work correctly after encountering errors with the process.
  </summary>

## 0.1.9

### Patch Changes

- [#127](https://github.com/fedimod/fires/pull/127) [`9f752ce`](https://github.com/fedimod/fires/commit/9f752ce41d727527b0e3bb06109e90ca97a90bc7) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix release not working"

## 0.1.8

### Patch Changes

- [#125](https://github.com/fedimod/fires/pull/125) [`d2f7be7`](https://github.com/fedimod/fires/commit/d2f7be786857367c4efae05786f3561f2853fecb) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Attempt again to get the release workflow to work

  It was still failing to detect the tags correctly.

## 0.1.7

### Patch Changes

- [#123](https://github.com/fedimod/fires/pull/123) [`b0327ac`](https://github.com/fedimod/fires/commit/b0327ac0d54efbc05ab7067f11eff58fa3e717ed) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Another attempt at release fires-server@0.1.x

## 0.1.6

### Patch Changes

- [#121](https://github.com/fedimod/fires/pull/121) [`91a0604`](https://github.com/fedimod/fires/commit/91a0604ec705ddf773f388484b71da2e7d69391b) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix missing quotes on json when doing releases

## 0.1.5

### Patch Changes

- [#119](https://github.com/fedimod/fires/pull/119) [`6d82599`](https://github.com/fedimod/fires/commit/6d825995d9f352305240b34d6aae8041f9c1b243) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Attempt to get the release to ship based on checking out a specific tag"

## 0.1.4

### Patch Changes

- [#117](https://github.com/fedimod/fires/pull/117) [`0f5b9c7`](https://github.com/fedimod/fires/commit/0f5b9c7c6f92abf286d67e62858c04698460c546) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix release once again

## 0.1.3

### Patch Changes

- [#115](https://github.com/fedimod/fires/pull/115) [`9c0224f`](https://github.com/fedimod/fires/commit/9c0224f5ac66d167145068daf001409ee7958ac0) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix releases again

## 0.1.2

### Patch Changes

- [#112](https://github.com/fedimod/fires/pull/112) [`a465fc5`](https://github.com/fedimod/fires/commit/a465fc5f20fc148123c42298b31ef73bbc796280) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix container image releases

## 0.1.1

### Patch Changes

- [#110](https://github.com/fedimod/fires/pull/110) [`41ec7d9`](https://github.com/fedimod/fires/commit/41ec7d98d2ba367702b615079355b361bf724f9a) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Release docker images correctly

  Previously the docker images for the release were meant to happen on push of tags, but for some reason the tags pushed by the `release.yml` workflow didn't trigger the action to run. I suspect that's because the tags were created via the API instead of via a `git push`. Have switched to using the release published event instead.

</details>

## 0.1.0

### Minor Changes

- [#62](https://github.com/fedimod/fires/pull/62) [`d3d6fd8`](https://github.com/fedimod/fires/commit/d3d6fd84ea0ce209939ebdd563ee8fbaa3579a30) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add CLI to support setting up a FIRES server

  This work was done in PR [#60](https://github.com/fedimod/fires/pull/60). The idea is to help someone configure a FIRES server, and eventually provision the issue admin-level bearer token for authentication.

  Provided a working installation of a FIRES server, you can run:

  ```
  node ace fires:setup
  ```

  Which will prompt you for the following questions:
  - Please give your new FIRES server a short description
  - What is your contact email? (publicly available)
  - What is the contact fediverse account?
  - Where is your website as a FIRES provider?
  - Do you have a website with documentation?
  - Where can people go to lodge an appeal for moderation decisions?
  - Would you like to redirect visitors to a different URL for this server?
    - (if yes) Which URL?

  Both the documentation and homepage URLs are optional, the rest are currently mandatory.

  This information will eventually be available when visiting the root of the FIRES server.

- [#50](https://github.com/fedimod/fires/pull/50) [`647e6af`](https://github.com/fedimod/fires/commit/647e6af2c551214855c0c617e30202a2900ad62e) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add required PUBLIC_URL environment variable

- [#36](https://github.com/fedimod/fires/pull/36) [`791d620`](https://github.com/fedimod/fires/commit/791d6206fb6a8bfa1e79c02952a3e5b71d36c636) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Bootstrap fires-server component
  - Sets up an adonis.js application with postgresql, lucid, vite, edge.js, and pico.css
  - Adds database configuration for using SSL CA Certificates (needed for people to deploy with providers like DigitalOcean's Managed Databases)
  - Disables multipart/form-data requests, as the FIRES server doesn't need to handle these, but there's no way to disable them in Adonis.js yet. See: https://github.com/adonisjs/bodyparser/pull/66

- [#47](https://github.com/fedimod/fires/pull/47) [`9455ab7`](https://github.com/fedimod/fires/commit/9455ab7b8682bd3f4e73a95d8ff5f78ec9b7720f) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add docker images to deployments

  We're now building both amd64 and arm64 docker images for fires-server.

- [#72](https://github.com/fedimod/fires/pull/72) [`ce2e791`](https://github.com/fedimod/fires/commit/ce2e791625c66766a50b6dea47974d44c4bded67) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Added support for NodeInfo Protocol

  This helps discovery of FIRES servers by using the well-known [NodeInfo
  Protocol](https://nodeinfo.diaspora.software/). We don't expose usage data
  because it's not relevant and the FIRES server doesn't have "users" as such.

  We're also currently using a non-standard `protocol` of `"fires"` as the
  protocol in NodeInfo Schema is defined as an enum of specific string values, so
  isn't extensible without new revisions to their specification, and it lacks a
  protocol registry (like what many IETF specs have), so I can't "register" the
  `"fires"` protocol.

  But at least this gives some discovery information.

- [#103](https://github.com/fedimod/fires/pull/103) [`8c3372c`](https://github.com/fedimod/fires/commit/8c3372c3972c623b02ed92a59a3d9654b069d418) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add CLI commands for Access Tokens

  This change introduces the following `node ace` commands to manage access tokens on the FIRES reference server:
  - `fires:tokens:list`
  - `fires:tokens:create`
  - `fires:tokens:delete <token_prefix>`

  Also updates the documentation and seeders to fix a few small issues.

- [#64](https://github.com/fedimod/fires/pull/64) [`81ebb83`](https://github.com/fedimod/fires/commit/81ebb830e3aecacbc36b8e96f6a3e75e03c97c37) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Implemented Labels API

  This provides a new set of APIs to the FIRES reference server, as well as documenting the API of the Labels endpoint(s) in the FIRES protocol.

  The FIRES protocol covers reading the collection of all labels and retrieving an individual label as both `text/html` and `application/json` or `application/ld+json`.

  The non-standard API for managing labels covers creating, updated, deprecating and deleting labels from the FIRES reference server.

- [#96](https://github.com/fedimod/fires/pull/96) [`8d4aa5a`](https://github.com/fedimod/fires/commit/8d4aa5a4717bdc8a69fdb60f3f74db3629ce0f7e) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Use `DATABASE_URL` in libpq compat mode for database connections

  This change removes the previous `DATABASE_*` environment variables, and replaces them with a singular `DATABASE_URL`. This ensures we have better handling of SSL Certificates for self-signed certificates (e.g., when the postgresql database is on a managed service like DigitalOcean).

  When using `DATABASE_URL` you can omit the database name (the path component of the connection string), in which case, we will automatically use the combined of `fires_` and the current `NODE_ENV` as the database name.

  Also introduced is `DATABASE_POOL_MAX` to configure the database pool size, as we weren't previously using database connection pooling.

- [#90](https://github.com/fedimod/fires/pull/90) [`b026248`](https://github.com/fedimod/fires/commit/b02624866628330ae6235d9e4c873239a5e7a170) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add authentication to API

  The API now requires authentication via HTTP Authorization header using a Bearer token. Each token has a number of scopes or 'abilities', such as read, write, admin. Currently the only API that exists and is protected is the labels API. In the future we may change scopes of tokens to more granular options, e.g., `read:labels`, `write:labels`, etc, but for now the coarse granularity is fine. The consumer of the FIRES server protocol does not know what scopes they have from the token alone, it is just an opaque access token.

  Internally in the reference server implementation for FIRES, we're using tokens that can be cryptographically verified before we attempt to check if the token actually exists in the database, which reduces the attack surface on the database compared to always querying for whether a user-supplied token exists in the database. This is inspired by how Ory.sh structures their access tokens. Tokens are prefixed with `fires_`.

### Patch Changes

- [#46](https://github.com/fedimod/fires/pull/46) [`02f2b07`](https://github.com/fedimod/fires/commit/02f2b07da20a218ee4bf3dd396547b21135617ea) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Migrate from npm to pnpm for better builds

- [#52](https://github.com/fedimod/fires/pull/52) [`56c8d47`](https://github.com/fedimod/fires/commit/56c8d479e652f24b58c3d610ff18f6ddfd6968f5) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix docker image labels, these weren't working correctly on edge images

- [#100](https://github.com/fedimod/fires/pull/100) [`ef6e170`](https://github.com/fedimod/fires/commit/ef6e1709a1a7634608974345d8e2d86b2ccf6e70) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Refactor: Improve request tests

  This switches us to use the japa plugin approach for request tests, injecting a `assertResponse` and `request` values into `TestContext`, which does the `createServer` / `createRequestInjection` logic automatically. In the future this plugin will be extracted into a stand-alone japa plugin for doing fast request testing.

  Also ensures the database is correctly setup before tests.
