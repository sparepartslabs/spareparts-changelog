# Tagged Release Contract

- Trigger: pushed tag matching `v*`, accepted only when it exactly matches `^v[0-9]+\.[0-9]+\.[0-9]+$` and package version.
- Permissions: `contents: write` only for the release job.
- Gate: install with scripts disabled; typecheck, lint, tests, committed bundle, plugin, package, and audit validation.
- Publication: create one GitHub release for the immutable tag, then force-update only `vMAJOR` to the triggering commit.
- Ordering: an unsuccessful validation or release never changes the major alias; releases sharing a major concurrency group do not overlap.
- Marketplace: first listing remains an organization-owner UI operation requiring the Developer Agreement and 2FA.
