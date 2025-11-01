---
"@fedimod/fires-server": minor
"@fedimod/fires-docs": minor
---

Implement Datasets with changes and snapshots

This marks the first time FIRES has been "fully functional" in that you can now create Datasets, store changes in them, and retrieve those changes via a JSON-LD API which is self-discoverable.

So for any given FIRES server, you can request GET /nodeinfo/2.1 which will contain points to the labels and datasets collections, from there for a given dataset, you can discover it's metadata (name, summary, description) and then access it's changes and snapshot which are collections of records.

The snapshot for a dataset is the latest change for any record within that dataset, where records are identified by their entity_kind and entity_key, so if you have 5 changes for the same record, the snapshot will include one item which is the latest value for that pair. This enables efficiently pulling in the latest copy of the dataset when you don't care about the history.

If you want the full history, you can follow the changes from the first page onward, once you reach a OrderedCollectionPage that doesn't have a next property, you can store the id of that page as your marker as to where to fetch from the next time you want to synchronise data.
