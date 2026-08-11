# Implementation Plan: End-User Changelogs

**Branch**: `001-end-user-changelogs` | **Date**: 2026-08-11 | **Spec**: [spec.md](spec.md)

## Summary

Build one deterministic TypeScript changelog engine that parses an explicit Conventional Commit range, renders canonical end-user Markdown, and idempotently updates a repository file. Expose it through a CLI and reusable GitHub Action without commit/push behavior. Independently enabled S3 and LinkedIn adapters consume the same artifact. A Codex plugin guides setup but delegates generation to the CLI.

## Technical Context

**Language/Version**: TypeScript 5.x targeting Node.js 20

**Primary Dependencies**: Git CLI, maintained Conventional Commit parser, GitHub Actions toolkit, AWS S3 SDK, built-in HTTP client, argument parser

**Storage**: Repository Markdown files and optional S3-compatible object storage; no database

**Testing**: Vitest unit/contract tests, fixture-repository integration tests, packaged action smoke tests, fake-client publisher tests, secret-canary tests

**Target Platform**: Linux/macOS/Windows CLI; GitHub-hosted and compatible Node 20 runners; Codex plugin distribution

**Project Type**: Library, CLI, JavaScript action distribution, publisher adapters, agent plugin

**Performance Goals**: Process 10,000 commits in under 10 seconds excluding network latency; identical inputs produce byte-identical output

**Constraints**: Offline-safe default; deterministic/idempotent; repository-relative paths; no implicit commit/push; publishers off by default; independent results; redacted secrets

**Scale/Scope**: One repository/range per run, changelogs up to 10 MiB, two initial external adapters, one Codex plugin; alternative source formats deferred

## Constitution Check

*GATE: Passed before research and again after design.*

The constitution is an unfilled template and imposes no project-specific gates. The approved spec/huddle contracts supply the gates:

- One canonical renderer shared by all surfaces: PASS.
- Repository output defaults on; all network publishers default off: PASS.
- No commit or push behavior: PASS.
- S3 and LinkedIn validate, execute, and report independently: PASS.
- Secrets never enter artifacts/config/logs and errors are sanitized: PASS.
- Stable ordering plus marked-section replacement guarantee determinism/idempotency: PASS.
- Post-design re-check: PASS; contracts and data model retain every gate.

## Project Structure

### Documentation

```text
specs/001-end-user-changelogs/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/{cli,github-action,publishers}.md
└── tasks.md
```

### Source Code

```text
action.yml
package.json
src/
├── domain/
├── git/
├── conventional/
├── render/
├── changelog/
├── publishers/{publisher,s3,linkedin}.ts
├── config/
├── cli/main.ts
└── action/main.ts
dist/action/index.js
plugin/
├── .codex-plugin/plugin.json
└── skills/changelog/SKILL.md
tests/{unit,contract,integration,security}/
```

**Structure Decision**: One package with domain/adapter boundaries prevents drift between CLI and action. The committed action bundle is the runtime artifact. The version-aligned plugin invokes the CLI rather than embedding generation logic.

## Delivery Phases

1. Deterministic domain, Git reader, parser, renderer, file updater, CLI, and fixtures.
2. Action input/output wrapper, bundle, metadata, and non-pushing tests.
3. Common publisher boundary, then independently tested S3 and LinkedIn adapters.
4. Codex plugin setup/generation skill with separate publisher consent gates.
5. Destination-matrix, idempotency, secret-canary, bundle, and quickstart verification.

## Complexity Tracking

No gate violations or complexity waivers.
