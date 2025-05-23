---
prev:
  text: "Concepts: Labels"
  link: /concepts/labels
next:
  text: "Definitions: Data Consumer"
  link: /concepts/terms/data-consumer
---

# Data Provider

A **Data Provider** is typically a web application that sits in front of a FIRES server and manages the data within it. They may also be command line tools, though these are typically less user friendly.

The [Example Provider](/manuals/example-provider/) being built is designed to source domain blocks from a collection of Fediverse servers, aggregating and pushing different sets of domains to a FIRES server based on consensus percentage.

A more advanced Data Provider might source a variety of data from Fediverse servers and other data sources, and provide a communal voting system for deciding which data to push to a FIRES server that the community runs.

**Data Providers** are typically individuals, groups, or organisations who maintain a set of moderation data, conducting threat intelligence research and handling other matters related to coordinating and improving the trust and safety of the Fediverse.
