---
"@fedimod/fires-server": minor
"@fedimod/fires-docs": minor
---

Revise JSON-LD Responses

This changes the JSON-LD responses for the labels and changes. For labels, the `type` changes to `fires:Label` to allow upgrade to the `Label` type being defined by the [ActivityPub Trust & Safety Taskforce](https://github.com/swicg/activitypub-trust-and-safety/issues/84), additionally `owl:deprecated` is now just `deprecated` and included in the FIRES JSON-LD context.

Normalized `entity_kind`, `entity_key`, `recommended_policy` and `recommended_filters` to camalCase, per JSON-LD Best Practices.

The changes within a dataset now have some more rules around their output:
- `Retraction` will only include the `entityKind` and `entityKey` properties, besides the core properties of `id`, `type` and `published`, and in the future a `comment`. They won't include `labels`, `recommendedPolicy` or `recommendedFilters`, since those no longer apply as of the retraction.
- `Tombstone` will only include the `id`, `type` and `published` properties (currently unused in the reference server).
- `Advisory` will have the properties `id`, `type`, `published`, `entityKind`, `entityKey`, `labels`.
- `Recommendation` will have all the properties of `Advisory`, and additionally `recommendedPolicy` and `recommendedFilters`

Also fixed is the IRI of the `fires` property in the JSON-LD context. Previously it was `https://fires.fedimod.org/ns#` and now it is `https://fires.fedimod.org/context/fires.jsonld#`
