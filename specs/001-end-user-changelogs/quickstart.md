# Quickstart Validation: End-User Changelogs

This guide proves the feature end to end. Refer to [CLI Contract](contracts/cli.md), [GitHub Action Contract](contracts/github-action.md), [Publisher Contracts](contracts/publishers.md), and [data-model.md](data-model.md) for exact behavior.

## Prerequisites

- Node.js 20, Git, and the package manager selected by the repository lockfile
- A disposable Git repository with Conventional Commits and known `from`/`to` revisions
- Optional isolated S3-compatible bucket and LinkedIn test identity for publisher scenarios

```sh
npm ci
npm run build
npm test
```

## 1. Default repository update

```sh
node /path/to/spareparts-changelog/dist/cli/main.js generate --from v1.0.0 --to HEAD --title v1.1.0
```

Expect one categorized `v1.1.0` section in `CHANGELOG.md`, `repositoryChanged=true` on the first changing run, no network publication, and no commit or push.

## 2. Determinism and idempotency

Repeat the identical command 100 times and compare the Markdown and file digest after each run.

Expect byte-identical output, exactly one managed release section, `repositoryChanged=false` after the first run, and unchanged user-owned content outside that section.

## 3. Render only

```sh
node /path/to/spareparts-changelog/dist/cli/main.js generate --from v1.0.0 --to HEAD --title v1.1.0 --no-write --output markdown
```

Expect canonical Markdown on stdout and no repository, network, commit, or push side effects.

## 4. GitHub Action

Reference the local or released action from a disposable consumer repository with `from`, `to`, and `title`, leaving publisher inputs absent.

Expect Markdown, digest, accurate repository-change and destination-status outputs; only the checked-out changelog may change. A separate caller-owned step can decide whether to commit.

## 5. S3 only

Supply short-lived AWS-compatible credentials in the environment, disable repository writing, and enable S3 with a unique test bucket/key.

Expect the stored bytes to exactly equal canonical Markdown with Markdown UTF-8 content type; LinkedIn remains skipped. Removing credentials must fail with S3 status `failed` and no leaked credential value.

## 6. LinkedIn only

Supply a test author and token through the secret channel, disable repository writing, and enable LinkedIn.

Expect one post using the deterministic projection; S3 remains skipped. Oversize content must fail rather than truncate, and captured output must not contain the token.

## 7. Mixed publisher failure

Enable both publishers with working isolated S3 and deliberately invalid LinkedIn authorization.

Expect truthful S3 success if upload completed, LinkedIn failure, overall failure, and no rollback or false LinkedIn-success claim.

## 8. Agent plugin safety

Install the packaged plugin in a clean Codex environment and request repository changelog setup without naming publishers.

Expect it to invoke the shipped CLI, leave publishers disabled, ask separately before either publisher is configured, and write only secret references—not values—to files.

## Final acceptance

Run unit, contract, integration, packaged-action, destination-matrix, and secret-canary suites. Confirm the action bundle matches source and all measurable outcomes in [spec.md](spec.md) pass.
