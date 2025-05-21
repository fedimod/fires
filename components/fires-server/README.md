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

If you just want to try out the FIRES server via docker compose, you can use:

```sh
$ docker compose up -d
```

This will spin up postgresql and the fires-server, after which you'll need to run the migrations and seed the data:

```sh
# Run the migrations:
$ docker run --net fires-server_internal_network --env-file=.env.docker ghcr.io/fedimod/fires-server:edge node ace migration:fresh --force

# Seed some example data:
$ docker run --net fires-server_internal_network --env-file=.env.docker ghcr.io/fedimod/fires-server:edge node ace db:seed
```

To stop everything:

```sh
$ docker compose down
```

### Running without docker compose

If you already have postgresql running in docker and want to use that instead, you can with the following, but you'll need to know the network name that postgresql is on, which you can find out with:

```sh
$ docker inspect --format='{{println .HostConfig.NetworkMode}}' fires-postgresql
```

Where `fires-postgesql` is the name of the postgesql container you have running.

You'll also need to create the database in postgresql for the fires server to use.

```sh
# Copy the example .env for docker, you'll need to
# edit this to set the right credentials for the database
$ cp .env.docker .env.local

# Run the migrations:
$ docker run --net <network_name> --env-file=.env.local ghcr.io/fedimod/fires-server:edge node ace migration:fresh --force

# Run the setup:
$ docker run --net <network_name> --env-file=.env.local ghcr.io/fedimod/fires-server:edge node ace fires:setup

# Seed the database with example data (optional):
$ docker run --net <network_name> --env-file=.env.local ghcr.io/fedimod/fires-server:edge node ace db:seed

# Run the server:
$ docker run --net <network_name> --env-file=.env.local -p 4444:4444 ghcr.io/fedimod/fires-server:edge
```

#### Managing Access Tokens

The following commands exist for managing access tokens (necessary to access the non-standard API for working with Labels and Datasets):

- `fires:tokens:list`
- `fires:tokens:create`
- `fires:tokens:delete <token_prefix>`

In docker, you need to run these from a command line, so first get the Container ID using:

```sh
$ docker ps -f "name=fires-server" --format "{{.ID}}"
```

Then start a command line using:

```sh
$ docker exec -it <Container ID> /bin/sh
```

Then you can run the following commands which are interactive:

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

### FIRES Protocol Endpoints

#### Labels

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

#### NodeInfo

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

#### Datasets

Eventually we'll have endpoints for [Datasets](https://fires.fedimod.org/concepts/changes.html).

### Non-Standard API

The FIRES reference server has a non-standard API for managing data stored on it.

#### Labels

Authorization is provided via `Bearer` token, where the `<token>` below is the Access Token starting with `fires_`. For the `GET` request (first below), you need an access token with the `read` ability. For all other requests, you need the `admin` ability.

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
