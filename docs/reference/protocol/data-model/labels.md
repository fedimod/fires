---
outline: deep
title: "Labels | Data Model | Protocol Reference"
next:
  text: "Data Model: Datasets"
  link: ./datasets
---

# Labels

> [!CAUTION]
> This section of the documentation is still being written.

An label is an object whose `type` property is `Label` from the FIRES JSON-LD context, which is located at: `https://fires.fedimod.org/ns`.

> [!NOTE]
> The `Label` type is currently being lifted up into a [separate Fediverse Enhancement Proposal](https://github.com/swicg/activitypub-trust-and-safety/issues/84) by the ActivityPub Trust & Safety Taskforce, so eventually the `type` will change to the same type as defined in that FEP.

Labels MUST have an `id` property, which MAY resolve to a label within a collection, or to an individual label. Labels MAY have a `url` property, which indicates the HTML representation of the label, if different from the label `id`.

When a label's `id` resolves within a collection, the hash fragment is used to identify the individual label within the collection. For example, for the collection with the `id` of `https://labels.fires.example/` containing the label `example`, the `id` for the label would be `https://labels.fires.example/#example`, since the collection is what you would need to fetch to fetch that label.

## Properties

| Property  | Description                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`    | URI: `https://www.w3.org/ns/activitystreams#name` <br><br>Range: `xsd:string` &#124; `rdf:langString` <br><br> A simple, human-readable, plain-text name for the label. HTML markup MUST NOT be included. The name MAY be expressed using multiple language-tagged values.                                                                                                                                  |
| `summary` | URI: `https://www.w3.org/ns/activitystreams#summary` <br><br>Range: `xsd:string` &#124; `rdf:langString` <br><br> A natural language summarization of the label encoded as HTML. Multiple language tagged summaries MAY be provided.                                                                                                                                                                        |
| `content` | URI: `https://www.w3.org/ns/activitystreams#content` <br><br>Range: `xsd:string` &#124; `rdf:langString` <br><br> The content or textual representation of the label encoded as a JSON string. By default, the value of content is HTML. The `mediaType` property can be used in the label to indicate a different content type.<br><br>The content MAY be expressed using multiple language-tagged values. |
| `context` | URI: `https://www.w3.org/ns/activitystreams#context`<br><br>Range: `Object` &#124; `Link`<br><br>Used to refer back to the collection that the label is part of.                                                                                                                                                                                                                                            |

Additional properties from other JSON-LD contexts may be present.

### Deprecation of Labels

Labels may indicate that they are deprecated through the use of the `owl:deprecated` property, as defined in [OWL 2 Web Ontology Language][1]

Deprecation of labels is preferable to deletion.

[1]: https://www.w3.org/TR/2012/REC-owl2-syntax-20121211/

## Examples

> [!WARNING]
> The context document used below does not actually exist yet.

An individual label in json-ld would look like:

```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    {
      "Label": "https://fires.fedimod.org/ns#Label"
    }
  ],
  "id": "https://labels.example.org/violent-threat",
  "type": "Label",
  "name": "Violent Threat",
  "summary": "summary for a violent threat",
  "content": "a fuller description for the violent threat label, contains HTML",
  "context": "https://labels.example.org/"
}
```

> [!TIP]
> See also [Labels API](../api/labels)
