---
"@fedimod/fires-server": patch
---

Add rate limiting for all endpoints

The rate-limits are per IP address. For dataset exports, they are per dataset per IP and fairly low, since this endpoint is quite expensive. For login, the rate limits are by IP and User.
