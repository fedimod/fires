---
title: "Project Background"
prev: false
next:
  text: Goals & Objectives
  link: ./goals-and-objectives
---

# Project Background

The Fediverse currently distributes information about instances that are distributing harmful or illegal content on the Fediverse via lists of domains that should be blocked from federating.

Historically these lists of domains were referred to as “blocklists”, however, the currently preferred language is “denylists”.

These denylists are lists of domains which should have federation prevented or be limited in specific ways. They are directly related to the “domain blocks” or “federation management” functionality in [Mastodon](https://joinmastodon.org/) and other fediverse software.

At present, when denylist are maintained, they are done so in the Mastodon CSV format, and only a limited amount of information is captured:

- Whether to prevent federation or just limit the reach of activities received from that instance/domain
- Optional unstructured text for a public comment explaining the block (Mastodon does have private comments, but these are not available in exported CSV files and the field is overwritten when importing them).
- Additional flags for rejecting media and rejecting reports.

Very commonly, the reason for a domain block is not provided, or if it is provided it is not written in a structured form, making it difficult for automated tooling and instance operators to decide whether to apply the domain blocks when given an exported CSV file. The only exception to this is the [Garden Fence](https://gardenfence.github.io/) denylist, which does label why a domain block exists in something of a machine-parsable format.

Various attempts have been made at improving denylists, however, fundamentally these denylists represent an all-or-nothing and very harsh approach to managing federation with other instances, and the act of creating a domain block in itself isn’t a strong enough signal about an instance/domain.

Denylists are also only at the level of instance federation, and lack support for sharing moderation information at a more granular level. This can result in entire instances being added to denylists for the actions of a few, rather than sharing information about moderating specifically those harmful users.

Sharing moderation information on specific actors/users will become increasingly important in an ever growing fediverse with the likes of [Meta’s](https://about.meta.com/) [Threads](https://threads.net) and [Wordpress.com](https://wordpress.com) joining the fediverse..

**FediMod FIRES is designed to support a wide range of moderation data, not just domains, but also actors, hashtags, urls, and more.** There's no reason that the moderation data that we share in the fediverse has to be limited to bad domains.
