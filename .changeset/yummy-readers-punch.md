---
"@fedimod/fires-server": minor
---

Fix error with dataset changes accidentally redirect

I'd accidentally gotten wrong the UUID format for the genesis (first) dataset change UUID,
it should have been `00000000-0000-7000-A000-000000000000` not `00000000-0000-7000-0000-000000000000`.

This caused a validation error to be thrown which resulted in the request being redirected to the homepage.
