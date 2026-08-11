# CLI Contract

## Command

`spareparts-changelog generate [options]` runs from the target repository root. Diagnostics use stderr; requested Markdown/JSON uses stdout.

## Inputs

| Option | Default | Contract |
|---|---|---|
| `--from <rev>` | required | Start/exclusion revision |
| `--to <rev>` | `HEAD` | Inclusive end revision |
| `--title <text>` | required | Non-empty release identity/title |
| `--changelog <path>` | `CHANGELOG.md` | Contained repository-relative path |
| `--write` / `--no-write` | write | Repository output only |
| `--s3` | false | Explicit S3 enablement |
| `--s3-bucket`, `--s3-key` | none | Required only with `--s3` |
| `--s3-region`, `--s3-endpoint`, `--s3-force-path-style` | environment/service defaults | Optional compatible-storage controls |
| `--linkedin` | false | Explicit LinkedIn enablement |
| `--linkedin-author <urn>` | none | Required only with `--linkedin` |
| `--output summary|markdown|json` | summary | Safe result format |

LinkedIn token is read only from `LINKEDIN_ACCESS_TOKEN`; AWS uses the caller's standard credential environment. Credentials are never CLI arguments.

## Outputs and Exit Status

JSON contains canonical `markdown`, `contentDigest`, `repositoryChanged`, and one safe result per destination. No credential-bearing fields are serialized.

| Code | Meaning |
|---:|---|
| 0 | Generation and all enabled destinations succeeded, including unchanged runs |
| 2 | Invalid/conditionally missing input |
| 3 | History or commit processing failed |
| 4 | Changelog validation/write failed |
| 5 | One or more enabled publishers failed; destination results still report |
| 1 | Unexpected safely redacted failure |

The CLI never commits or pushes. `--no-write` does not enable a publisher, and a failed enabled publisher cannot exit 0.
