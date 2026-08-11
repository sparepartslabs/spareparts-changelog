# Data Model: End-User Changelogs

## ReleaseRequest

Immutable invocation intent: required `from`/`to` revision range and non-empty release `identity`; repository-relative `changelogPath` defaulting to `CHANGELOG.md`; `writeRepository` defaulting true; independently optional S3 and LinkedIn configurations. Revisions must resolve and paths must remain inside the repository.

## SourceCommit

Fields: full `hash`, original `subject`, `body`/footers, and stable traversal `position`. The range uses `from..to` semantics. An empty valid range yields an explicit no-user-visible-changes artifact.

## ChangeEntry

Fields: `sourceHash`, ordered `category`, normalized end-user `summary`, optional `scope`, `breaking`, `userVisible`, and traversal `position`.

Categories have fixed order: Breaking Changes, Added, Fixed, Improved, Changed, Removed, Security. Breaking entries are elevated. Rendered summaries are non-empty and Markdown-safe; one source commit produces at most one primary entry in v1.

## ReleaseArtifact

Fields: release identity, ordered entries, omitted count, canonical UTF-8 `markdown`, and stable `contentDigest`. It is immutable after rendering and is the exact artifact supplied to every output adapter.

## ChangelogDocument

Fields: validated repository path, optional original bytes, managed sections keyed by release identity, updated bytes, and `changed` boolean. It preserves bytes outside the target marked region and uses the existing line-ending convention.

State transitions:

```text
missing -> created (changed)
existing/no match -> inserted (changed)
matching/identical -> unchanged
matching/different -> atomically replaced (changed)
invalid path/markers -> failed without partial write
```

## Destination Configurations

`RepositoryDestination`: enabled defaults true; path defaults `CHANGELOG.md`.

`S3Destination`: enabled defaults false; bucket/key required only when enabled; optional region, HTTPS endpoint, and path-style flag; credentials remain environment-owned and never enter this model.

`LinkedInDestination`: enabled defaults false; author URN and secret token required only when enabled; token is transient and never serialized.

## DestinationResult

Fields: destination (`repository`, `s3`, `linkedin`), status (`skipped`, `unchanged`, `succeeded`, `failed`), safe location, optional sanitized error code, and redacted message. Each configured destination produces exactly one attributable result.

## RunResult

Fields: artifact, `repositoryChanged`, ordered destination results, and overall success. Overall success is false on generation/write failure or any enabled publisher failure.

## Relationships

```text
ReleaseRequest -> selects SourceCommit*
SourceCommit -> normalizes to ChangeEntry 0..1
ChangeEntry* -> forms one ReleaseArtifact
ReleaseArtifact -> updates ChangelogDocument 0..1
ReleaseArtifact -> is consumed unchanged by enabled publishers
Each destination -> returns DestinationResult
Artifact + destination results -> RunResult
```
