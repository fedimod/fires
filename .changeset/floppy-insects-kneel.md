---
"@fedimod/fires-server": patch
---

Fix encoding of special characters in entities

This ensures that the entity key is always encoded correctly:
- domains are punycode encoded
- URLs for actors have the hostname punycode encoded and the rest of the URL correctly encoded (e.g., special characters are escaped)

The administrative UI also now shows that the entity key has been encoded in some way, and provides information showing the decoded value.
