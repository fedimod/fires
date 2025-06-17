# FIRES Reference Server Implementation

[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

## Features

- [x] /.well-known/nodeinfo endpoints
- [x] Labels Endpoint
- [x] non-standard API for managing Labels (still need to figure out a standardisable API here)
- [x] Basic Web UI for reading data
- [x] Authentication & Authorization
- [ ] Datasets

## Running in Docker

First you'll need an [environment file](https://github.com/fedimod/fires/blob/main/components/fires-server/.env.docker), to create this use:

```
# Copy the example .env for docker, you'll need to
# edit this to set the right credentials for the database and the `APP_KEY`:
$ cp .env.docker .env.docker.local
```

Then you can try out the FIRES server via [docker compose](https://github.com/fedimod/fires/blob/main/components/fires-server/docker-compose.yml), this will automatically use the `.env.docker.local` file:

```sh
$ docker compose up -d
```

This will spin up postgresql and the reference fires server.

To stop everything, use:

```sh
$ docker compose down
```

### Database Migrations

If you're just deploying a single container of the FIRES reference server, the default `.env.docker.local` will automatically run the migrations on startup for you. This is controlled via the `DATABASE_AUTOMIGRATE` environment variable, which if truthy will cause the migrations to automatically be run.

**NOTE:** If you're running more than one instance of the FIRES reference server container, then using automatic migrations can cause deployment issues due to multiple concurrent attempts at running the migrations happening at once, in which case you likely want to use manual migrations.

#### Manual Migrations

To run the migrations manually, use the following:

```sh
$ docker run --rm --net fires-server_internal_network --env-file=.env.docker.local ghcr.io/fedimod/fires-server:edge node ace migration:run --force
```

#### Resetting the database:

If you need to wipe the database and recreate it, use:

```sh
$ docker run --rm --net fires-server_internal_network --env-file=.env.docker.local ghcr.io/fedimod/fires-server:edge node ace migration:fresh --force
```

#### Seeding the database with example data

For testing purposes, it can be handy to add a bunch of seed data to the database, this can be done with:

```sh
$ docker run --rm --net fires-server_internal_network --env-file=.env.docker.local ghcr.io/fedimod/fires-server:edge node ace db:seed
```

### Running administrative commands:

In docker, you need to run these from a command line, so first get the Container ID using:

```sh
$ docker ps -f "name=fires-server" --format "{{.ID}}"
```

Then start a command line using:

```sh
$ docker exec -it <Container ID> /bin/sh
```

#### Setting up the server:

From within the command line, you can run the interactive setup with:

```sh
# Run the interactive setup:
$ node ace fires:setup
```

#### Managing Administrative Users

The following command exists for adding users that can access the admin UI:

- `fires:users:create`

There is currently no mechanism for deleting or disabling a user account.

#### Managing Access Tokens

The following commands exist for managing access tokens (necessary to access the non-standard API for working with Labels and Datasets):

- `fires:tokens:list`
- `fires:tokens:create`
- `fires:tokens:delete <token_prefix>`

You can run these commands, which are interactive, from the docker command line:

```sh
# Create an access token:
# Note: the full access token will only be printed once.
$ node ace fires:tokens:create

# List access tokens:
$ node ace fires:tokens:list

# Delete an access token
# - <token_prefix> is the value to match on, for example: fires_1SE0R62F10juqJaTBwzMmwaNbxtBOQh8
$ node ace fires:tokens:delete <token_prefix>
```

When you're done, you can enter `exit` to exit the command prompt.

Unfortunately at this time it is not possible to run these commands via `docker run` due to a bug that causes the command to not correctly accept input.

## FIRES Protocol Endpoints

### Labels

The Labels endpoints return data according to the [Labels](https://fires.fedimod.org/reference/protocol/labels.html) section in the [FIRES Protocol Reference](https://fires.fedimod.org/reference/protocol/).

```http
GET /labels
Accept: application/ld+json
```

Will return the Collection of Labels as JSON-LD

```http
GET /labels/:id
Accept: application/ld+json
```

Will return an individual Label as JSON-LD

### NodeInfo

The FIRES reference server supports the [NodeInfo Specification](https://nodeinfo.diaspora.software/).

```http
GET /.well-known/nodeinfo
Accept: application/json
```

```http
GET /nodeinfo/2.1
Accept: application/json
```

Returns the NodeInfo data about the FIRES server (excluding usage data)

### Datasets

Eventually we'll have endpoints for [Datasets](https://fires.fedimod.org/concepts/changes.html).

## Non-Standard API

The FIRES reference server has a non-standard API for managing data stored on it.

### Authentication

Authentication and authorization is provided via `Bearer` access tokens. In the examples below the `<token>` string is the Access Token starting with `fires_`.

These access tokens are managed with the commands described in "Managing Access Tokens" above.

### Labels

For the `GET` request (first below), you need an access token with the `read` ability. For all other requests, you need the `admin` ability.

```http
GET /api/labels
Authorization: Bearer <token>
```

Returns the raw list of labels on the server.

```http
POST /api/labels
Authorization: Bearer <token>

{"name": "test label"}
```

Creates a new label on the FIRES server called "test label"

```http
PATCH /api/labels/:id
Authorization: Bearer <token>

{"summary": "test label for demonstration purposes"}
```

Partially updates the label identified by `:id`

```http
PUT /api/labels/:id
Authorization: Bearer <token>

{"name": "Edited label", "summary": "test label for demonstration purposes"}
```

Overwrites the label identified by `:id`

```http
DELETE /api/labels/:id
Authorization: Bearer <token>
```

Deprecates the label identified by `:id`

```http
DELETE /api/labels/:id?force=true
Authorization: Bearer <token>
```

Completely deletes the label identified by `:id`, usage of this isn't recommended in production servers, as the label may be present in an existing dataset.

---

## Acknowledgements

[<img src="/docs/public/nlnet-logo.svg" alt="NLNet" height="80px" />](http://nlnet.nl)&nbsp;&nbsp;&nbsp;&nbsp;
[<img src="/docs/public/NGI0Entrust_tag.svg" alt="NGI Zero" height="80px"/>](http://nlnet.nl/NGI0)

This project was funded through the <a href="https://NLnet.nl/entrust">NGI0 Entrust</a> Fund, a fund established by <a href="https://nlnet.nl">NLnet</a> with financial support from the European Commission's <a href="https://ngi.eu">Next Generation Internet</a> programme, under the aegis of <a href="https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en">DG Communications Networks, Content and Technology</a> under grant agreement N<sup>o</sup> 101069594.
<br><br><br>
[<img src="/docs/public/nivenly-foundation-logo-with-text.png" alt="Nivenly Foundation" height="80px"/>](http://nivenly.org)

The writing of the proposal outlining FIRES was funded by <a href="https://nivenly.org">Nivenly Foundation</a>.
