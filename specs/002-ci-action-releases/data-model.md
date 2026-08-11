# Data Model: CI and Action Releases

## Validation Check

- **Fields**: workflow name, job name, trigger, permissions, result.
- **Validation**: name remains stable; pull-request permissions are read-only; all required commands succeed.
- **States**: queued → running → passed/failed/cancelled.

## Release Tag

- **Fields**: full tag (`vX.Y.Z`), package version, commit SHA, major alias (`vX`).
- **Validation**: stable semantic version only; package version equals tag without `v`; commit is the triggering ref.
- **States**: detected → validated → released → aliased; any failure terminates before the next transition.

## Distribution Artifact

- **Fields**: Action manifest, bundled JavaScript, plugin manifest/skills, package archive surface.
- **Validation**: rebuild is byte-identical; plugin validators pass; package contents remain expected.

## Marketplace Enrollment

- **Fields**: Developer Agreement accepted, organization owner, 2FA enabled, release UI listing selected.
- **Validation**: documented as manual prerequisites rather than workflow-managed state.
