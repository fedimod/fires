---
"@fedimod/fires-server": minor
"@fedimod/fires-docs": minor
---

Implement CSV Imports for Datasets

This implements the ability to import data into a FIRES server from existing domain block CSV files.

What's not implemented during imports is labelling data, since there's simply no way to fit it into the current admin panel design (I'm toying with a redesign). Originally I tried to detect the labels from the public comment, but it just didn't make much sense.
