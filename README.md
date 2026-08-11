# Spare Parts Changelog

Generate AI-written, evidence-grounded end-user Markdown from Conventional Commits. By default the CLI updates `CHANGELOG.md` in the working tree and never commits or pushes. S3 and LinkedIn are independently opt-in.

## CLI

```sh
ANTHROPIC_API_KEY=... npx spareparts-changelog generate --provider anthropic --from v1.0.0 --to HEAD --title v1.1.0
```

Use `--no-write --output markdown` for render-only output. Repeating the same range and title replaces the same managed section without duplication. Supported user-facing types initially include `feat`, `fix`, `perf`, `security`, `deprecate`, and `remove`; maintenance-only commits are omitted.

S3 requires `--s3 --s3-bucket ... --s3-key ...` and standard AWS environment credentials. LinkedIn requires `--linkedin --linkedin-author ...` and `LINKEDIN_ACCESS_TOKEN`. See `specs/001-end-user-changelogs/contracts/cli.md` for exit codes.

## GitHub Action

The action updates the checked-out file but leaves checkout credentials, commits, and pushes to the calling workflow. See `examples/` for repository-only and opt-in publisher configurations.

## CI, releases, and GitHub Marketplace

Pull requests run tests on Node 20, 22, and 24, validate lint/formatting, rebuild and compare the committed Action bundle, validate the Codex plugin, audit dependencies, and scan for secrets. Protect `main` with the exact checks documented in [`specs/002-ci-action-releases/contracts/checks.md`](specs/002-ci-action-releases/contracts/checks.md).

To release, first update `package.json` and the plugin version, commit the regenerated distribution, then push the matching stable tag such as `v1.2.3`. The tag workflow repeats validation, creates the immutable GitHub release, and only then moves the matching major Action alias (`v1`) to that commit. Invalid, prerelease, and package-mismatched tags fail without moving an alias.

GitHub Marketplace enrollment is not fully automatable through the release workflow or an API toggle. For the initial listing, an organization owner must accept the GitHub Marketplace Developer Agreement, have two-factor authentication enabled, and select the Marketplace publication checkbox in GitHub's release UI. After that manual setup, this repository's tagged workflow automates GitHub releases and the floating major tag used by Action consumers.
