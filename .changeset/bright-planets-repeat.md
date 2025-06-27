---
"@fedimod/fires-server": patch
---

Fix error with missing locale when creating a label

It turns out a disabled form field does not actually submit the value that is selected when the form is submitted, as such that hidden input for locale that I didn't think I needed was actually needed. I've also changed the controller to handle the locale in a more graceful manner.
