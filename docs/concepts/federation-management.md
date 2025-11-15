# Federation Management

A key part of moderating a Fediverse server is dealing with federated content. Moderation actions can be as narrow as just removing certain content or suspending remote accounts that are harmful or problematic to your community, or they can be as wide reaching as preventing federation and severing relationships with entire servers.

At present, by operating a server in the Fediverse the default behaviour is that it federates openly with any other server that wants to communicate with your server, this is known as "open federation". The opposite of that is known as "limited federation" or "closed federation", however this generally does not have the same capabilities for moderation as "open federation" does. Typically these features are implemented with dedicated "domain blocks" or "domain allows" tables, indicating which servers to moderate in open federation and limited federation respectively.

## Firewall-based approach to Federation Management

This is where taking a inspiration from network firewalls can help provide a better mental model of federation management. In a network firewall, there are multiple options available for keeping your system safe:

- You can allow or deny traffic from a particular host (and port)
- You can filter traffic from a particular host (and port)
- You can deny or allow outgoing traffic to a particular host (and port)
- You can manage traffic based on protocol (e.g., tcp, udp, icmp, http)

Many fediverse software projects simply allow the "you can deny traffic between a particular host and your server" pattern, whilst having a default policy of allowing all traffic. Mastodon's "limited federation mode" switches out the ability to deny traffic with denying all traffic by default and having specific policies to allow specific traffic, effectively the inverse.

By taking cues from firewalls, we can design a simpler, much better system for managing federation, for instance we can apply policies to a variety of entities including domains, actors and IP Address Ranges and have a default policy for how we handle federation with unknown entities.

We can then have policies that fit into one of four main categories:

1. Allow or accept federation with a given entity
2. Filter federation with a given entity
3. Reject or deny federation with a given entity
4. Drop any federation with a given entity

There is a fourth category which is to have "no opinion" about federation with a given entity, under which your default policy would apply, whether that's to allow, reject or filter federation.

This model simplifies the processing of inbound and outbound activities by having only one table for considering the processing against, and allows for much more dynamic moderation options by having an extensive selection of possible filters to apply and when to apply them. It also reduces duplication by not needing to duplicate UI code for managing federation in two artificially separate code paths.

## FediMod FIRES Implementation

In FediMod Fires, we make use of this firewall-inspired approach to Federation Management, with each [Advisory](./changes/advisories.md) or [Recommendation](./changes/recommendations.md) containing the properties of `recommendedPolicy` and `recommendedFilters`.

The `recommendedPolicy` values are as follows:

- **“accept”** means that we’re explicitly allowing for federation or interaction.

- **“filter”** means to look at the `recommendedFilters` property, and to apply the [appropriate filtering](./filters.md). This is close to the behaviour of Mastodon’s “silence” and “noop” values for severity.

- **“reject”** means to actively send back a [`Reject` activity](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-reject) to the sending server, informing them that you did not accept the incoming activity.

- **“drop”** means to not accept any activity from this entity, and provide no acknowledgement to the sender that the activity was not accepted (i.e., return a 2xx status code but just discard the activity). This is synonymous to Mastodon’s “suspend” severity.
