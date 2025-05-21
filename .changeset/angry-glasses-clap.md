---
"@fedimod/fires-server": minor
---

Add CLI to support setting up a FIRES server

This work was done in PR [#60](https://github.com/fedimod/fires/pull/60). The idea is to help someone configure a FIRES server, and eventually provision the issue admin-level bearer token for authentication.

Provided a working installation of a FIRES server, you can run:

```
node ace fires:setup
```

Which will prompt you for the following questions:
- Please give your new FIRES server a short description
- What is your contact email? (publicly available)
- What is the contact fediverse account?
- Where is your website as a FIRES provider?
- Do you have a website with documentation?
- Where can people go to lodge an appeal for moderation decisions?
- Would you like to redirect visitors to a different URL for this server?
  - (if yes) Which URL?

Both the documentation and homepage URLs are optional, the rest are currently mandatory.

This information will eventually be available when visiting the root of the FIRES server.
