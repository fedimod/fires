---
outline: deep
title: "Labels | API | Protocol Reference"
next:
  text: "API: Datasets"
  link: ./datasets
prev:
  text: "Data Model: Changes"
  link: ../data-model/changes
---

# Labels API

> [!CAUTION]
> This section of the documentation is still being written.

The Label endpoints within the FIRES protocol are not explicitly defined, however they are constrained to certain semantics, which this page documents. These endpoints are used for retrieving information about [labels](/concepts/labels.md), and how labels are managed is not defined by the FIRES protocol.

A server that is serving label endpoints DOES NOT need to implement the full FIRES protocol, this allows for servers to exist that only provide labels and nothing else.

Once published, `Label`s SHOULD NOT be deleted, since there may be references to that label in downstream [Datasets](../types/datasets.md), instead, [deprecation](../types/labels.md#deprecation-of-labels) is preferred.


## Content Negotiation

To support providing humans with a readable version of labels and label collections, the server MUST support either:
* [content negotiation][2] for content types of `text/html`, `application/json`, and `application/ld+json`, or
* have a `url` property indicating the URL at which clients can direct people to for a human-readable version.

So for instance, a collection may have the `id` of `https://labels.fires.example/8b5df8dd-4e31-487c-af7a-d3d48b2cfed0/`, which responds with `application/ld+json`, but the human readable version may be located at `https://labels.fires.example/collections/dtsp`.

## Collections of Labels

Labels exist within a collection which are standard [ActivityStreams 2][1] `Collection` or `OrderedCollection` objects with the constraint that all the items MUST be `Label` objects. A server MAY return a collection with or without paging.

A server MAY return complete `Label` objects within the collection, including the `content` property, or a minimal representation which just contains the properties: `id`, `name`, `summary`, and `url` (if content negotiation is not supported).

### Example

> [!WARNING]
> The context document used below does not actually exist yet.

```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    {
      "Label": "https://fires.fedimod.org/ns#Label"
    }
  ],
  "summary": "Example Labels",
  "type": "OrderedCollection",
  "id": "https://labels.example.org/",
  "totalItems": 1,
  "orderedItems": [
    {
      "id": "https://labels.example.org/violent-threat",
      "type": "Label",
      "name": "Violent Threat",
      "summary": "summary for a violent threat"
    }
  ]
}
```

[1]: https://www.w3.org/TR/activitystreams-core/
[2]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation
