---
title: "Why not…? | Project Background"
---

# Why not…?

## Why not ActivityPub

At present, to implement moderation information / knowledge sharing via ActivityPub, we would be required to have the server handle all incoming activities from servers that FIRES federates with, which would add significant load to the server, whilst resulting in zero benefits. We would also need to specify additional activity and object types via a FEP, and these types could interact poorly with other applications on the network.

Whilst ActivityPub can operate in a pull-based manner, synchronising collections of data becomes tricky, since ActivityPub does not have collection synchronisation built-in. Instead, we'd need to rely on complicated synchronisation mechanisms such as [FEP-8fcf](https://codeberg.org/fediverse/fep/src/branch/main/fep/8fcf/fep-8fcf.md#fep-8fcf-followers-collection-synchronization-across-servers).

## Why not WebSub or Webhooks

The [WebSub](https://www.w3.org/TR/websub/#title) protocol is a push-based protocol, allowing clients to subscribe to updates. Functionally it is very similar to Webhooks, so carries all the security considerations that Webhooks do, for instance, WebSub’s [security considerations](https://www.w3.org/TR/websub/#security-considerations) do not mention that someone can register a _Subscriber Callback URL_ whose DNS resolves to an private IP address (such as localhost or a reserved IP range), allowing them to redirect the request from leaving your network to targeting your internal infrastructure and network.

Stripe has implemented an entire [HTTP Proxy](https://github.com/stripe/smokescreen) that they deploy to prevent certain attack scenarios related to Webhooks, such as [Server-Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery).

The benefit of using WebSub or Webhooks would be that we could push data more quickly to consumers, however, consumers may be offline or unavailable, in which case we need to handle the failures and retry at a later date, which adds complexity and reliability concerns. Additionally a consumer may go permanently offline or offline for an extended period, in which case we’d need to add a mechanism to “refresh” the Webhook connection (this same problem sometimes affects an ActivityPub server’s deliverability, and shows up in the Mastodon Admin UI as an “unavailable instance”).

The API proposed for FIRES is a pull-based API with pagination allowing consumers to fetch what is newer than a given “Change ID” (which is a UUID v7 which features a time-orderable property), this means we can allow consumers to pickup at arbitrary points in the changes, always allowing them to get the correct changes to apply to their server, regardless of when they were last able to synchronise with the server running FIRES.

This isn’t to say that Webhooks or WebSub will not be an option in the future, but for the first version of the FIRES, we’re focusing on pull-based subscriptions, since they are simpler to implement, have fewer security considerations to keep in mind, require less administrative tooling (how do you create a Webhook?), and even if we did implement push-based subscriptions, we would still need a mechanism for pull-based data access (for the first-time data gathering process).
