# Environment Variables

The FIRES reference server implementation has the following configuration via environment variables. If you've configured a server using the automated installer, then it is unlikely that you would need to change any of these.

| Environment Variable | Description                                                                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | The port for the node.js server to listen on                                                                                                        |
| HOST                 | The host for the node.js server to listen on, if running in docker this should be `0.0.0.0`, otherwise `127.0.0.1`                                  |
| PUBLIC_URL           | This is the URL of your FIRES server on the internet.                                                                                               |
| DEFAULT_LOCALE       | The default locale for the FIRES server, should be a valid BCP-47 language tag                                                                      |
| APP_KEY              | This is used for encryption and hashing, should be a long random string                                                                             |
| DATABASE_URL         | The `postgresql://` connection URL for the postgresql database.                                                                                     |
| DATABASE_POOL_MIN    | Minimum number of pool connections for postgresql                                                                                                   |
| DATABASE_POOL_MAX    | Maximum number of pool connections for postgresql                                                                                                   |
| DATABASE_AUTOMIGRATE | When set to `true` the server will automatically run any pending database migrations on startup                                                     |
| FIRES_ADMIN_USERNAME | If set, along with `FIRES_ADMIN_PASSWORD`, the server will automatically create an administrative user on startup if no administrative users exist. |
| FIRES_ADMIN_PASSWORD | The password for the administrative user, see above.                                                                                                |

There is an [example environment variables](https://github.com/fedimod/fires/blob/main/components/fires-server/.env.example) file in the git repository.

By default, the automated installer stores the environment variables for the `fires-server` container in `/fires-server/fires-server.env` and the `postgresql` container in `/fires-server/postgresql.env`.
