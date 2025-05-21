# Reference Server Implementation

> [!CAUTION]
> This section of the documentation is still being written.

In order to show a working example of the FIRES protocol and its features, we've built a reference server implementation. Whilst this could be used in production, it probably best not to until it reaches version 1.0.0.

The easiest way to get started is to use docker, for that we need some basic configuration in a file containing some environment variables called `.env.docker.local`:

```conf
TZ=UTC
NODE_ENV=production
LOG_LEVEL=info

PORT=4444
HOST=0.0.0.0
PUBLIC_URL=http://localhost:4444/

# You can generate an APP_KEY with: `node ace generate:key` or `openssl rand -base64 48`
# It just needs to be a long random value, changing it will invalidate all access tokens:
APP_KEY=

# The database name in the connection string is optional, and defaults to
# `fires_<NODE_ENV>` if not present.
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432
DATABASE_POOL_MAX=10
```

The FIRES reference server depends on [postgresql](https://postgresql.org), and by default uses a database named `fires_production` (assuming `NODE_ENV` is `production`). You'll need to create this database in order for the reference server to be able to use it (the docker compose file automatically creates this database).

You can now start up the docker compose:

```sh
$ docker compose up -d
```

With everything started, we now need to run the migrations:

```sh
$ docker run --net fires-server_internal_network --env-file=.env.docker.local ghcr.io/fedimod/fires-server:edge node ace migration:run --force
```

Now you can access the FIRES reference server at: `http://localhost:4444`.

For further documentation, please see the reference server [README](https://github.com/fedimod/fires/tree/main/components/fires-server#readme).
