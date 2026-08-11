# Implementation Plan: CI and Action Releases

**Branch**: `feat/end-user-changelogs` | **Date**: 2026-08-11 | **Spec**: [spec.md](spec.md)

## Summary

Add least-privilege GitHub workflows for matrix CI, dependency and secret scanning, committed Action/plugin distribution checks, and stable tag releases. A validated `vX.Y.Z` tag creates a GitHub release before force-updating only `vX`. Marketplace enrollment remains explicitly manual where GitHub requires owner agreement, 2FA, and UI selection.

## Technical Context

**Language/Version**: TypeScript 5.9; Node.js 20 runtime with CI on 20, 22, and 24  
**Primary Dependencies**: npm, GitHub Actions, TruffleHog, GitHub release tooling  
**Storage**: Git tags/releases and committed repository artifacts  
**Testing**: Vitest plus repository verification scripts and workflow static tests  
**Target Platform**: GitHub-hosted Ubuntu runners  
**Project Type**: npm package, JavaScript Action, Codex plugin  
**Performance Goals**: ordinary PR validation completes without serialized matrix jobs  
**Constraints**: pull-request jobs read-only; releases tag-only; no Marketplace automation claim; committed bundle byte-stable  
**Scale/Scope**: one repository, three Node versions, one stable major alias per release

## Constitution Check

The constitution is an unfilled template and imposes no actionable gates. This plan preserves the feature's existing deterministic build, disabled-by-default external publication, and non-pushing consumer Action contracts. Gate result: PASS before and after design.

## Project Structure

```text
.github/
├── dependabot.yml
└── workflows/
    ├── dependency-scan.yml
    ├── release.yml
    ├── secret-scan.yml
    └── test.yml
scripts/
├── validate-plugin.mjs
└── verify-distribution.mjs
specs/002-ci-action-releases/
├── contracts/
├── plan.md
├── quickstart.md
├── research.md
├── spec.md
└── tasks.md
```

## Design Notes

- Keep matrix checks stably named `Tests / Node 20`, `Tests / Node 22`, and `Tests / Node 24`; put formatting, bundle, and plugin validation in one stable `Distribution / committed artifacts` check.
- Keep `Dependency scan / npm audit` and `Secret scan / trufflehog` separate so branch protection can require or diagnose them independently.
- Validate the tag strictly and compare it with `package.json` before granting the release job write operations.
- Serialize releases by major tag and use `git tag -f` plus an explicit single-ref force push only after release creation succeeds.

## Complexity Tracking

No constitution violations or unnecessary abstractions.
