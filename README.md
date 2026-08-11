# Spare Parts Changelog

Generate deterministic, end-user-facing Markdown from Conventional Commits. By default the CLI updates `CHANGELOG.md` in the working tree and never commits or pushes. S3 and LinkedIn are independently opt-in.

## CLI

```sh
npx spareparts-changelog generate --from v1.0.0 --to HEAD --title v1.1.0
```

Use `--no-write --output markdown` for render-only output. Repeating the same range and title replaces the same managed section without duplication. Supported user-facing types initially include `feat`, `fix`, `perf`, `security`, `deprecate`, and `remove`; maintenance-only commits are omitted.

S3 requires `--s3 --s3-bucket ... --s3-key ...` and standard AWS environment credentials. LinkedIn requires `--linkedin --linkedin-author ...` and `LINKEDIN_ACCESS_TOKEN`. See `specs/001-end-user-changelogs/contracts/cli.md` for exit codes.

## GitHub Action

The action updates the checked-out file but leaves checkout credentials, commits, and pushes to the calling workflow. See `examples/` for repository-only and opt-in publisher configurations.
