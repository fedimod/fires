---
outline: deep
title: "Changes | Data Model | Protocol Reference"
next:
  text: "API: Labels"
  link: ../api/labels
prev:
  text: "Data Model: Datasets"
  link: ../data-model/datasets
---

# Changes

> [!CAUTION]
> This section of the documentation is still being written.

[Datasets](./datasets.md) in the FIRES protocol contain a collection of changes. These changes can have one of the following types from the FIRES JSON-LD context, which is located at: `https://fires.fedimod.org/context/fires.jsonld`:

| Type             | Description                                                                                                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Advisory`       | Used for providing early notice of a potential future `Recommendation`.                                                                                                                       |
| `Recommendation` | Used to provide a recommendation to moderators consuming this Dataset.                                                                                                                        |
| `Retraction`     | Used to indicate that an `Advisory` or a `Recommendation` has been retracted and should be removed from consumers' state (e.g., by removing suspension of federation with a specific domain). |
| `Tombstone`      | Used to indicate that the given change `id` no longer exists. (Not currently implemented in the FIRES reference server). Usage is generally discouraged.                                      |

Usually the `type` for a given change `id` will not change, with the exception of `Tombstone` which retroactively applies to all changes for a given `entityKind` and `entityKey`.

The usage of `Tombstone` is generally discouraged in favour of `Retraction`, since a tombstone effectively deletes data from the dataset. A possible use-case for using a `Tombstone` is if the dataset provider has been forced by legal order to remove an entity from their dataset (e.g., in cases of defamation where the content within the dataset was deemed by a court order to be libelous or slander).

## Core Properties

The core properties shared across all types of changes are as follows:

| Property    | Description                                                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | URI: `@id`<br><br>Range: `xsd:anyURI`<br><br>See ActivityStreams 2.0's [`id` property](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-id)                                |
| `type`      | URI: `@type`<br><br>Range: `xsd:anyURI`<br><br>Known types within the FIRES JSON-LD Context are: `Advisory`, `Recommendation`, `Retraction` and `Tombstone`                     |
| `published` | URI: `https://www.w3.org/ns/activitystreams#published`<br><br>See ActivityStreams 2.0's [`published` property](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-published) |

## Types

### Advisory

An `Advisory` extends the Core Properties has the following additional properties:

| Property     | Description                                                                                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entityKind` | URI: `https://fires.fedimod.org/context/fires.jsonld#entityKind`<br><br>Range: `xsd:string`<br><br>The kind of entity being represented. Currently known values are `domain` and `actor`.                      |
| `entityKey`  | URI: `https://fires.fedimod.org/context/fires.jsonld#entityKind`<br><br>Range: `xsd:string`<br><br>The identifier for the entity.                                                                              |
| `labels`     | URI: `https://fires.fedimod.org/context/fires.jsonld#labels`<br><br>See [Labels](./labels.md). Generally within a Dataset, these will be `xsd:anyUri` references to a `Label`, instead of the complete object. |

### Recommendation

A `Recommendation` extends `Advisory`, and includes the following additional properties:
| Property | Description |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `recommendedPolicy` | URI: `https://fires.fedimod.org/context/fires.jsonld#recommendedPolicy`<br><br>Range: `xsd:string`<br><br>The policy being recommended to the consumer. Currently known values are: `accept`, `filter`, `reject`, and `drop`. See [Federation Management](../../../concepts/federation-management.md). |
| `recommendedFilters` | URI: `https://fires.fedimod.org/context/fires.jsonld#recommendedFilters`<br><br>Range: `xsd:anyUri`<br><br>Container: `@set`<br><br>The filters to apply when `recommendedPolicy` is `filter`. |

### Retraction

A `Retraction` extends the Core Properties has the following additional properties:
| Property | Description |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `comment` | URI: `https://fires.fedimod.org/context/fires.jsonld#comment`<br><br>Range: `xsd:string`<br><br>A short description describing why the retraction was issued. |

### Tombstone

A `Tombstone` extends the Core Properties and has no additional properties.
