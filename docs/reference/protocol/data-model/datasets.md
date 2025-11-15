---
outline: deep
title: "Datasets | Data Model | Protocol Reference"
next:
  text: "Data Model: Changes"
  link: ./changes
prev:
  text: "Data Model: Labels"
  link: ./labels
---

# Datasets

A dataset is an object whose `type` property is `Dataset` from the FIRES JSON-LD context, which is located at: `https://fires.fedimod.org/context/fires.jsonld`.

Datasets have information about what they contain as well as endpoints for interacting with the dataset. The properties for a dataset include `name`, `summary`, `content`, `published` and `updated` properties from the [AS2 Context](https://www.w3.org/TR/activitystreams-vocabulary/#properties). The `updated` property refers to when the dataset itself was modified, not when the dataset's changes were last modified. Datasets may include a `url` property that points to the human-readable version of the dataset (i.e., website).

To initially retrieve the current state of the dataset, a consumer can make a request to the `snapshot` endpoint which returns a `OrderedCollection` containing the latest state of all the entities within the dataset. The first item will be the newest change in the dataset.

Once the snapshot has been received, servers can regularly synchronise their copy of the dataset via the `changes` endpoint included in the snapshot response, which includes the cursor for pagination within in the changes feed.

If you want to consume the full changes of the dataset, you can incrementally apply by requesting the `changes` endpoint which returns an `OrderedCollection` where the newest change is on the last page, and reducing them using the `entity_kind` and `entity_key` as grouping keys (this is how the snapshot is constructed).

## Example:

```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://fires.fedimod.org/context/fires.jsonld"
  ],
  "id": "https://fires.example/datasets/3102b05b-55e0-4f79-9672-fa7bf8bfd7e9",
  "url": "https://fires.example/datasets/dni-list",
  "type": "Dataset",
  "name": "DNI List",
  "summary": "Contains moderation recommendations for handling the worst-of-the-worst of federating servers",
  "content": "An optional fuller description for this dataset. Can contain <strong>html</strong>",
  "endpoints": {
    "changes": "https://fires.example/datasets/3102b05b-55e0-4f79-9672-fa7bf8bfd7e9/changes",
    "snapshot": "https://fires.example/datasets/3102b05b-55e0-4f79-9672-fa7bf8bfd7e9/snapshot"
  }
}
```

## Localisation

The `name`, `summary` and `content` properties are all localisable via the `nameMap`, `summaryMap` and `contentMap` properties, per [ActivityStreams 2.0](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-name).

## Properties

Datasets inherit most of their properties from `Object` in ActivityStreams 2.0 context. The non-standard properties are as follows:

| Property             | Description                                                                                                                                                                                                                                                |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `endpoints.snapshot` | URI: `https://fires.fedimod.org/context/fires.jsonld#snapshot`<br><br>Range: `Collection`<br><br>Snapshot of the latest state of all the changes within the Dataset, reduced by the `entity_kind` and `entity_key` properties (selecting the latest value) |
| `endpoints.changes`  | URI: `https://fires.fedimod.org/context/fires.jsonld#chnages`<br><br>Range: `OrderedCollection`<br><br>An Ordered Collection containing all the changes made within the Dataset over time. The newest changes are appended to the end of this collection.  |
