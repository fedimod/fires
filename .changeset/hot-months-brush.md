---
"@fedimod/fires-server": minor
---

Add human-friendly URLs to Labels

This changeset provides prettier URLs for human visitors, whilst still using the unchanging UUID identifier for use in datasets and machine-readable contexts. Additionally, it adds interlinking between the admin panel and the logged out homepage, and introduces copyable input boxes for the URL/IRIs of labels.

Note: Changing a labels `name` will result in the URL changing for that label, and currently we don't preserve the previous URL and perform redirects, so this will break visitors.
