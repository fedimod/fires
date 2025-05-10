---
"@fedimod/fires-server": minor
---

Add authentication to API

The API now requires authentication via HTTP Authorization header using a Bearer token. Each token has a number of scopes or 'abilities', such as read, write, admin. Currently the only API that exists and is protected is the labels API. In the future we may change scopes of tokens to more granular options, e.g., `read:labels`, `write:labels`, etc, but for now the coarse granularity is fine. The consumer of the FIRES server protocol does not know what scopes they have from the token alone, it is just an opaque access token.

Internally in the reference server implementation for FIRES, we're using tokens that can be cryptographically verified before we attempt to check if the token actually exists in the database, which reduces the attack surface on the database compared to always querying for whether a user-supplied token exists in the database. This is inspired by how Ory.sh structures their access tokens. Tokens are prefixed with `fires_`.
