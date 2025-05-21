---
"@fedimod/fires-server": patch
---

Release docker images correctly

Previously the docker images for the release were meant to happen on push of tags, but for some reason the tags pushed by the `release.yml` workflow didn't trigger the action to run. I suspect that's because the tags were created via the API instead of via a `git push`. Have switched to using the release published event instead.
