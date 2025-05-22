---
"@fedimod/fires-server": patch
"@fedimod/fires-docs": patch
---

Add automatic running of migrations on server startup

By setting the `DATABASE_AUTOMIGRATE` environment variable to `true`, you can now have the container for the FIRES reference server automatically run the migrations on startup if necessary. This can make deployment simpler in some cases.
