# Publisher Contracts

Each adapter accepts the same immutable ReleaseArtifact plus only its validated configuration, and returns one safe DestinationResult. It cannot update the changelog, enable another adapter, re-render, commit, or push. Disabled adapters perform no validation, credential lookup, or network call.

## S3-Compatible

Requires explicit enablement, bucket, key, and credentials resolvable from the caller environment. Optional region/custom HTTPS endpoint/path style support compatible services. Upload exact canonical UTF-8 Markdown as `text/markdown; charset=utf-8`. Results may expose safe bucket/key and version/etag, never credentials, signed URLs, headers, or raw requests.

## LinkedIn

Requires explicit enablement, author URN, and secret token. Deterministically project release title, category headings, and bullets from canonical Markdown without generative rewriting. Reject content exceeding destination limits instead of silently truncating. Results may expose a safe post ID, never token, headers, request objects, or unsanitized response bodies.

## Failure and Secret Safety

All enabled adapters run and report independently; any failure fails the overall run, while completed successes remain truthfully reported without rollback claims. Failure classes are `configuration`, `credentials`, `authorization`, `content-limit`, `transport`, and `remote`.

Known secrets are registered with host masking, credential fields are excluded by construction, caught errors pass central sanitization, and canary tests assert secrets never appear in stdout, stderr, action outputs, files, or structured results.
