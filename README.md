# FIRES

[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

**FediMod FIRES** is a protocol and reference server implementation for storing and distributing moderation data over time for the Fediverse. It is intended to be used by teams to provide moderation recommendations and advisories, based on their research, to moderators and administrators of Fediverse servers.

**FIRES** stands for **F**ediverse **I**ntelligence **R**eplication **E**ndpoint **S**erver.

**FediMod** is project to provide a home for various Fediverse moderation tools and projects.

## Features

- **Only provides moderation advisories and recommendations**, rather than prescribing that a given action must be taken.
- **Not designed for the creation of denylists**, moderators should always make the final decision that is right for their community.
- **Embraces linked data and multiple data sources**, we borrow ideas from linked data, to ensure that all moderation advisories and recommendations are well structured and contain enough information for Moderators to make an informed decision.
- **Allows resumable retrieval of data**, instead of being push-based which requires maintaining a network connection to the FIRES server, FIRES is designed to allow clients to periodically refresh their copy of the data.

## Documentation

The documentation to FIRES is split into a few sections:

- [Background](https://fires.fedimod.org/concepts/background/)
- [Concepts](https://fires.fedimod.org/concepts/)
- [Protocol Specification](https://fires.fedimod.org/reference/protocol/)

For the runnable components in this repository, you can find documentation at:
- [Reference Server](/components/fires-server/README.md)

## Acknowledgements

[<img src="/docs/public/nlnet-logo.svg" alt="NLNet" height="80px" />](http://nlnet.nl)&nbsp;&nbsp;&nbsp;&nbsp;
[<img src="/docs/public/NGI0Entrust_tag.svg" alt="NGI Zero" height="80px"/>](http://nlnet.nl/NGI0)

This project was funded through the <a href="https://NLnet.nl/entrust">NGI0 Entrust</a> Fund, a fund established by <a href="https://nlnet.nl">NLnet</a> with financial support from the European Commission's <a href="https://ngi.eu">Next Generation Internet</a> programme, under the aegis of <a href="https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en">DG Communications Networks, Content and Technology</a> under grant agreement N<sup>o</sup> 101069594.
<br><br><br>
[<img src="/docs/public/nivenly-foundation-logo-with-text.png" alt="Nivenly Foundation" height="80px"/>](http://nivenly.org)

The writing of the proposal outlining FIRES was funded by <a href="https://nivenly.org">Nivenly Foundation</a>.
