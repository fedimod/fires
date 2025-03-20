---
outline: deep
prev: false
---

# Labels

> [!CAUTION]
> This section of the documentation is still being written.

The Labels endpoint of the FIRES protocol is used for retrieving information about [labels](../../concepts/labels.md). A host that is serving labels DOES NOT need to implement the full FIRES protocol, this allows for commonly used content management systems to be used for managing and serving the labels for that provider.

The endpoint MUST support content negotiation for both `text/html` and `application/json` or `application/ld+json` content-types. This allows clients to link end-users to the page for information on a specific label, whilst still enabling machine-readable data.

A collection of Labels is a standard [ActivityStreams 2][1] `Collection`. A server MAY return a collection with or without paging. The items of the collection must all be `Label` objects.

The Labels endpoint of the FIRES protocol is for retrieval only, and does not specify how labels are created or updated. It is recommended that labels are not deleted once published, since there may be references to that label in other datasets.

## `Label` objects

An label is an object whose `type` property is `Label` from the FIRES JSON-LD context: `https://fires.fedimod.org/ns`. The `type` property MAY be represented as `"type": "Label"` or `"type": "https://fires.fedimod.org/ns#Label"`, following standard JSON-LD practices.

Labels MUST have an `id` property, which MAY resolve to a label within a collection, or to an individual label. When referencing a label within a collection, it is recommended you use a hash fragment to identify the label within the collection, e.g., `https://labels.example.org/#example`.

| Property      | Description |
| ----------- | ----------- |
| `name`      | URI: `https://www.w3.org/ns/activitystreams#name` <br><br>Range: `xsd:string` &#124; `rdf:langString` <br><br> A simple, human-readable, plain-text name for the label. HTML markup MUST NOT be included. The name MAY be expressed using multiple language-tagged values. |
| `summary`   | URI: `https://www.w3.org/ns/activitystreams#summary` <br><br>Range: `xsd:string` &#124; `rdf:langString` <br><br> A natural language summarization of the label encoded as HTML. Multiple language tagged summaries MAY be provided. |
| `content`   | URI: `https://www.w3.org/ns/activitystreams#content` <br><br>Range: `xsd:string` &#124; `rdf:langString` <br><br>  The content or textual representation of the label encoded as a JSON string. By default, the value of content is HTML. The `mediaType` property can be used in the label to indicate a different content type.<br><br>The content MAY be expressed using multiple language-tagged values. |
| `context`   | URI: `https://www.w3.org/ns/activitystreams#context`<br><br>Range: `Object` &#124; `Link`<br><br>Used to refer back to the collection that the label is part of. |

Additional properties from other JSON-LD contexts may be present.

## Deprecation of Labels

Labels may indicate that they are deprecated through the use of the `owl:deprecated` property, as defined in [OWL 2 Web Ontology Language][2]

Deprecation of labels is preferable to deletion.

[1]: https://www.w3.org/TR/activitystreams-core/#collections
[2]: https://www.w3.org/TR/2012/REC-owl2-syntax-20121211/
