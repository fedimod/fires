---
title: "Historical Context | Project Background"
---

# Historical Context

This section provides a brief overview of the moderation tooling as it relates to denylists or “blocklists”, and the functionality in various Fediverse software for handling federation management.

Historically, the format used to distribute denylists has been dictated by the format that [Mastodon](https://joinmastodon.org) has used for importing and exporting domain blocks, which is a CSV file with specific columns and values which mean specific things to Mastodon. This results in interoperability issues between Fediverse Software projects and leads to a situation of a “de facto standard by most-used implementation”. There is an alternative CSV format known as the [FediBlockSync CSV format](https://github.com/eigenmagic/fediblockhole/blob/main/samples/demo-blocklist-01.csv), but it is largely the same as the Mastodon format.

Additionally, these CSV files have a maximum row count of 20,000 rows when imported into Mastodon (due to being processed as part of the request/response lifecycle).

[Pixelfed](https://pixelfed.org/), [Misskey](https://misskey-hub.net/en/), [Mbin](https://joinmbin.org/) and [Lemmy](https://join-lemmy.org/) all currently do not support importing denylists of domain blocks using the Mastodon formatted CSV files, but they do feature their own ways for managing instance-level domain blocks. Some of these projects do have APIs for managing domain blocks, though these are usually only available on a per-user basis rather than instance-wide, and the instance-wide options are often via a single “config” value, rather than properly structured models representing federation management.

**Pixelfed** does support importing a dataset of instances from a custom formatted JSON document in their admin panel, and offers [a tool for converting](https://dansup.github.io/masto2pixel/) between the Mastodon CSV file format and the Pixelfed JSON document format. Pixelfed is [reportedly working](https://mastodon.social/@dansup/112982425034464618) on improved federation management.

**Misskey, Mbin, and Lemmy** all only support a new line delimited list of domains which should be blocked from federation, without the nuance that not everything needs to be defederated completely and losing the context of “why” something was blocked.

These CSV-based lists are also generally distributed via code hosting services such as GitHub and Codeberg, or via just CSV file downloads from a data provider’s website, which means that they are point-in-time snapshots. This means that to figure out the changes to a list over time, you must manually diff between two copies of the list, or look at version control histories.

Often the _“why”_ behind changes is difficult to determine, given the unstructured text field for public comments are the only means through which to communicate the _“why”_ and you have to rely on diffs of CSV files to see what changed.

Additionally, as they are lists of instances to block federation with, it is important to note that many providers of denylists [have made mistakes](https://seirdy.one/posts/2023/05/02/fediverse-blocklists/#mistakes-made), and these mistakes can often cause irreparable damage when lists are imported with implicit trust that the data contained within is accurate, and when [retraction lists cannot easily be imported](https://github.com/mastodon/mastodon/issues/25261) into software.

Finally, these lists are very often distributed as an “all or nothing” approach, which whilst this works for the worst-of-the-worst, can have negative consequences for instances that may post undesirable or problematic content, but who are not outright harmful to the general population (e.g., it’s common to see sex worker oriented instances or instances with more open stances on nudity or sexual content on some of these lists, as what happened to switter.at and woof.group due to various differences in community standards to other fediverse instances).
