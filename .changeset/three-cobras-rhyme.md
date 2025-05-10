---
"@fedimod/fires-server": minor
---

Use `DATABASE_URL` in libpq compat mode for database connections

This change removes the previous `DATABASE_*` environment variables, and replaces them with a singular `DATABASE_URL`. This ensures we have better handling of SSL Certificates for self-signed certificates (e.g., when the postgresql database is on a managed service like DigitalOcean).

When using `DATABASE_URL` you can omit the database name (the path component of the connection string), in which case, we will automatically use the combined of `fires_` and the current `NODE_ENV` as the database name.

Also introduced is `DATABASE_POOL_MAX` to configure the database pool size, as we weren't previously using database connection pooling.
