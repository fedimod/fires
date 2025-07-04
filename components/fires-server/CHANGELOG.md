# @fedimod/fires-server

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
