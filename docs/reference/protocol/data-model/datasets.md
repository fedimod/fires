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

> [!CAUTION]
> This section of the documentation is still being written.

A dataset is an object whose `type` property is `Dataset` from the FIRES JSON-LD context, which is located at: `https://fires.fedimod.org/ns`.

Datasets contain information about what they contain as well as endpoints for interacting with the dataset. To initially retrieve the current state of the dataset, a consumer can make a request to the `snapshot` endpoint which returns a `Collection` containing the latest state of all the entities within the dataset.

Once the snapshot has been received, servers can regularly synchronise their copy of the dataset via the `changes` endpoint, passing the latest known `change_id` to retrieve entries newer than that change.

```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    {
      "Dataset": "https://fires.fedimod.org/ns#Dataset"
    }
  ],
  "id": "https://fires.example/datasets/3102b05b-55e0-4f79-9672-fa7bf8bfd7e9",
  "type": "Dataset",
  "name": "DNI List",
  "summary": "Contains moderation recommendations for handling the worst-of-the-worst of federating servers",
  "content": "An optional fuller description for this dataset",
  "endpoint": {
    "changes": "https://fires.example/datasets/3102b05b-55e0-4f79-9672-fa7bf8bfd7e9/changes",
    "snapshot": "https://fires.example/datasets/3102b05b-55e0-4f79-9672-fa7bf8bfd7e9/snapshot"
  }
}
```
