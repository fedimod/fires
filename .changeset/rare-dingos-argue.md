---
"@fedimod/fires-server": minor
---

Implement UI for administering the reference server

Following early user feedback that the API-only approach wasn't easy to use, we've implemented a basic admin panel for the FIRES reference server implementation. This is protected using database backed authentication.

To create users for access to the admin panel, use the following command:

```sh
$ node ace fires:users:create
```

For docker, you can run this command per the [Running Administrative Commands](https://github.com/fedimod/fires/tree/main/components/fires-server#running-administrative-commands) documentation.

The UI for server administration allows updating the name, summary, description, appeals and documentation URLs, and setting a contact email (though this is currently not used anywhere). It also allows for the creation and editing of Labels, but not currently the deletion or deprecation of them.
