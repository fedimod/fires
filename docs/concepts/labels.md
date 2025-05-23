---
next:
  text: "Definitions: Data Provider"
  link: ./terms/data-provider
---

# Labels

In order to better support interoperability between different FediMod FIRES servers, running as [Data Providers](./terms/data-provider.md), and [Data Consumers](./terms/data-consumer.md), we have introduced the concept of “Labels”.

Labels in FediMod FIRES are URIs that can be both:

- followed by a human to view a human readable page explaining the Label
- dereferenced by software to discover machine readable information about the Label

Data Providers can reuse Labels from different [Label Providers](./terms/label-provider.md) as well as being a Label Provider themselves if they need additional labels which haven't been yet defined, or whose definition they need to change. Label Providers can extend other Label Providers by annotating their labels as being the "same as" or "similar to" another Label.

As a Data Provider annotating the recommendations and advisories with Labels enables both machines and humans to better understand the information being presented. For instance, a Data Consumer may choose to automatically apply recommendations with one label, but require human review for another label.

If you're interested to see how labels look in the protocol, see [Protocol Reference: Labels](../reference/protocol/data-model/labels.md).
