---
"@fedimod/fires-server": patch
---

Fix account management validation errors

- The permissions and administrative checkboxes are now correctly validated together.
- The permissions and administrative checkboxes now correctly retain their state throughout validation errors.
- The password confirmation is only visible if the password input has a value.
- The password input is required for new accounts
- Fixed input labels for new account vs editing account
