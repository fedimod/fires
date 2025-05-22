---
"@fedimod/fires-server": patch
---

Fix bug with Server details being incorrectly displayed

In some situations, the two settings for the server name and summary were being displayed in the wrong position, e.g., name would appear as summary and summary as name. This turned out to be a bug in how we were fetching the settings back in the middleware that supplies this information to the views.
