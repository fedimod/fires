# Reference Server Implementation

> [!CAUTION]
> This section of the documentation is still being written.

In order to show a working example of the FIRES protocol and its features, we've built a reference server implementation. Whilst this could be used in production, it is probably best not to until version 1.0.0 is released.

The FIRES reference server depends on [postgresql](https://postgresql.org) version 17 or greater.

## Quick start with Docker

The easiest way to get started is to use docker or similar container runtime, for that we need some basic configuration in a file containing some environment variables called `.env.production`:

```dotenv
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
DATABASE_URL=postgresql://fires:super_secret_password_123@fires-postgresql:5432
DATABASE_POOL_MAX=10
DATABASE_AUTOMIGRATE=true
```

The configuration above will use a database named `fires_production` by default.

You will need to generate a value for `APP_KEY` that is a reasonably long random value, this can be done with `openssl rand -base64 48` or similar.

We can create a `docker-compose.yml` with the following contents:

```yml
name: fires-example
services:
  postgresql:
    container_name: fires-postgresql
    restart: always
    image: postgres:17-alpine
    shm_size: 256mb
    networks:
      - internal_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 2s
      retries: 5
      start_period: 10s
      timeout: 10s
    volumes:
      - ./postgres17:/var/lib/postgresql/data
    environment:
      - "POSTGRES_USER=fires"
      - "POSTGRES_PASSWORD=super_secret_password_123"
      - "POSTGRES_DB=fires_production"

  web:
    container_name: fires-server
    image: ghcr.io/fedimod/fires-server:0.5
    restart: always
    env_file: .env.production
    networks:
      - external_network
      - internal_network
    healthcheck:
      # prettier-ignore
      test: ['CMD-SHELL',"curl -s --noproxy localhost localhost:4444/health | grep -q 'OK' || exit 1"]
    ports:
      - "127.0.0.1:4444:4444"
    depends_on:
      postgresql:
        condition: service_healthy
        restart: true

networks:
  external_network:
  internal_network:
    internal: true
```

You can now start up the docker compose:

```sh
$ docker compose up -d
```

With everything started, we can now seed some data, first we need to get the container ID for the `fires-server`:

```sh
$ docker ps -f "name=fires-server" --format "{{.ID}}"
```

Then we can start a command shell inside that container, where `$ContainerID` is replaced with the result from the previous command:

```sh
$ docker exec -it $ContainerID /bin/sh
```

Finally, we can seed some example data in our server:

```sh
$ node ace db:seed
```

Now you can access the FIRES reference server at: `http://localhost:4444/`.

> [!CAUTION]
> The `db:seed` will create a user with the credentials `admin` / `password` (the most secure credentials ever).

For deploying to production, you shouldn't use the seeder but rather create a user interactively from the docker container shell:

```sh
$ node ace fires:users:create
```

For further documentation, please see the reference server [README](https://github.com/fedimod/fires/tree/main/components/fires-server#readme).
