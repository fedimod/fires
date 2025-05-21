---
"@fedimod/fires-server": patch
---

Add CLI commands for Access Tokens

This change introduces the following `node ace` commands to manage access tokens on the FIRES reference server:

- `fires:tokens:list`
- `fires:tokens:create`
- `fires:tokens:delete <token_prefix>`

Also updates the documentation and seeders to fix a few small issues.
