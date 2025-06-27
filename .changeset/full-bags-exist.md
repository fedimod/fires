---
"@fedimod/fires-server": patch
---

Fix bug when attempting to create a new label

When attempting to create a new label after the addition of translations, an error would be thrown due to trying to load the relationships for an unpersisted model. Additionally, the locale select show incorrect data during this flow.

Furthermore, when creating a label with translations, those translations were not saved.
