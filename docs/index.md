---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "FediMod FIRES"
  text: "Fediverse Intelligence Replication Endpoint Server"
  tagline: A protocol and reference server implementation for storing and distributing moderation advisories and recommendations over time for the Fediverse.
  actions:
    - theme: brand
      text: Learn the Concepts
      link: /concepts/
    - theme: alt
      text: Project Background
      link: /concepts/background/

features:
  - title: Only provides advisories and recommendations
    details: |
      Rather than prescribing that a given action must be taken, FIRES publishers only suggest an action to take. Consumers of data should always provide control over what is applied to instances.
      <br/><br/>
      Moderators should always make the final decision that is right for their community.
  - title: Not designed just for the creation of denylists
    details: |
      Whilst a server can publish just information about domain moderation, we shouldn't limited to just domains. Often there's more nuanced data that can be shared with moderation teams.
      <br/><br/>
      Domain moderation is a heavy hammer, when sometimes you need a chisel.
  - title: Embraces linked data and multiple data sources
    details: |
      Borrowing ideas from linked data concepts, moderation advisories and recommendations are well structured and contain enough information for Moderators to make an informed decision.
      <br/><br/>
      This also allows for extensibility to support new data types in the future.
  - title: Allows resumable retrieval of data
    details: |
      Instead of being push-based which requires the server to maintain a list of consumers interested in updates, or real-time requiring consumers to always be online.
      <br/><br/>
      FIRES is designed to allow consumers to periodically refresh their copy of the data using just the last  known change ID.
---

## Project funding

<a href="https://nlnet.nl" class="funder-logo" name="ack"><img src="/nlnet-logo.svg?url" alt="Logo NLNet: abstract logo of four people seen from above"></a>
<a href="https://nlnet.nl/NGI0" class="funder-logo"><img src="/NGI0Entrust_tag.svg?url" alt="Logo NGI Zero: letterlogo shaped like a tag"> </a>

This project was funded through the <a href="https://nlnet.nl/entrust">NGI0 Entrust</a> Fund, a fund established by <a href="https://nlnet.nl">NLNet</a> with financial support from the European Commission's <a href="https://ngi.eu">Next Generation Internet</a> (NGI) programme, under the aegis of <a href="https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en">DG Communications Networks, Content and Technology</a> under grant agreement N<sup>o</sup> 101069594.
<br><br>
The writing of the proposal initially outlining FediMod FIRES was funded by <a href="https://nivenly.org">Nivenly Foundation</a>.
