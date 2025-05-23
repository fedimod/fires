---
title: "Prior Art | Project Background"
---

# Prior Art

This proposal acknowledges that many people have worked on denylists and federation / moderation management, and lists those projects here, noting both the good and bad outcomes:

- [Garden Fence](https://gardenfence.github.io/), a provider of domain denylists, provides only point-in-time exports of data. However, their approach to labelling why domains are present is sound and can be rather easily made compatible with the labelling functionality proposed in this proposal.
- [Federation Safety Enhancement Project](https://docs.google.com/document/d/17YmAvRbk_wf6RhWhFbRya9SvUMpoY2s4ZRnt9bqLtwA/view) proposal hinted at some of the same ideas as this proposal, which draws inspiration for the labelling (a rather obscure footnote in FSEP), and makes it a first-class feature, as well as encouraging exposing data to end-users and instance operators. However, this proposal lacked strong peer-review and was difficult to read and understand, resulting in significant community backlash and intense discussion.
- [TheBad.Space](https://thebad.space/about) has its own API, which has its [source code publicly available](https://koodu.ubiqueros.com/are0h/TheBadSpace) supports Mastodon CSV exports, but doesn’t currently have endpoints for list management or seeing changes over time which can make it hard to audit and synchronise. In september 2023, a bug occurred during which a significant number of trans-run instances were incorrectly added to their denylist for defederation, due to how their algorithmic denylist was constructed.
- [Oliphants Blocklists](https://codeberg.org/oliphant/blocklists/src/branch/main/blocklists), which are available in multiple different tiers and aggregations, but lacks labelling of why instances are present on the list, and lack a good means for consuming changes over time (it is possible via the git commit diffs, but those are not particularly useful for replication or distribution purposes). The Oliphant Max List, being the union of all its data sources, was taken down after it was revealed that this could result in lists becoming transphobic or queerphobic due to some data sources being personal instances that blocked other instances for personal reasons.
- [FediBlockHole](https://github.com/eigenmagic/fediblockhole) is a tool that can be used to ingest CSV-based lists and subsequently call various API methods to synchronise an instance’s data with the lists’ data. Related here is the [IFTAS FediCheck](https://about.iftas.org/activities/moderation-as-a-service/fedicheck/) service.
- Pleroma’s [Message Rewrite Facility](https://docs-develop.pleroma.social/backend/configuration/mrf/) which can be used to completely mutate Activities received by the server, optionally dropping them, through either a simple policy, or custom policies which are written in Erlang.
- [BlueSky’s Labels](https://blueskyweb.xyz/blog/4-13-2023-moderation) functionality is similar, but different in that it doesn’t really carry recommendations about courses of action to take, it just provides the labels for content.

> [!WARNING] TODO
> Add link to Erin’s post about moderation tooling and the Lemmy thread about moderation

- Additionally, this proposal is inspired by the [Kappa Architecture](https://milinda.pathirage.org/kappa-architecture.com/), [Apache Kafka](https://kafka.apache.org/), and [CouchDB](https://couchdb.apache.org/), with regards to how they handle changes, data replication and synchronisation.

Additionally, this proposal is based on conversations had with various domain and industry experts during 2023, which have either happened via private conversations or invite-only group calls.
