---
"@fedimod/fires-server": minor
---

Added support for NodeInfo Protocol

This helps discovery of FIRES servers by using the well-known [NodeInfo
Protocol](https://nodeinfo.diaspora.software/). We don't expose usage data
because it's not relevant and the FIRES server doesn't have "users" as such.

We're also currently using a non-standard `protocol` of `"fires"` as the
protocol in NodeInfo Schema is defined as an enum of specific string values, so
isn't extensible without new revisions to their specification, and it lacks a
protocol registry (like what many IETF specs have), so I can't "register" the
`"fires"` protocol.

But at least this gives some discovery information.
