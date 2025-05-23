---
title: "Retractions | Managing Changes"
---

# Retractions

A major problem that exists when sharing moderation decisions is that of being able to retract a decision later, if that decision wasn't a good one. In the current system of using CSV files for domain denylists, the only way to handle retractions is to have a separate CSV file that stores any retractions, which makes management difficult.

Within FediMod FIRES, retractions have first-class support, and any moderation decision that is shared can have a retraction issued for it. This will be a normal change record stored within the FIRES dataset, which just applies the inverse policy for the record we want to retract. For example, if we had previously told people to reject federation with a specific domain, a retraction would now be telling them that they may want to allow federation with that domain again.

This enables us to always publish an append only log of moderation decisions, ensuring synchronisation can always happen.
