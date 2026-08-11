# Tasks: CI and Action Releases

## Phase 1: Setup

- [x] T001 Create GitHub workflow and dependency-update directories in `.github/workflows/` and `.github/dependabot.yml`
- [x] T002 Verify Node, npm, distribution, and ignore configuration in `package.json`, `.gitignore`, `.npmignore`, and `.prettierignore`

## Phase 2: Foundational

- [x] T003 Define stable protected-check and release contracts in `specs/002-ci-action-releases/contracts/checks.md` and `specs/002-ci-action-releases/contracts/release.md`
- [x] T004 Add workflow static-contract validation script and npm command in `scripts/validate-workflows.mjs` and `package.json`

## Phase 3: User Story 1 - Trust every proposed change

**Independent test**: Run all local CI commands and verify the static workflow validator sees six exact required checks with read-only PR permissions.

- [x] T005 [P] [US1] Add Node 20/22/24 test matrix and committed artifact validation in `.github/workflows/test.yml`
- [x] T006 [P] [US1] Add scheduled and PR dependency audit in `.github/workflows/dependency-scan.yml`
- [x] T007 [P] [US1] Add pinned full-history secret scan in `.github/workflows/secret-scan.yml`
- [x] T008 [P] [US1] Add npm and GitHub Actions weekly updates in `.github/dependabot.yml`
- [x] T009 [US1] Validate CI workflow contracts with `scripts/validate-workflows.mjs`

## Phase 4: User Story 2 - Release a stable Action reference

**Independent test**: Validate the release workflow rejects non-stable/package-mismatched tags and orders release creation before the constrained major alias update.

- [x] T010 [US2] Add tag-only gated GitHub release and semver-major alias workflow in `.github/workflows/release.yml`
- [x] T011 [US2] Extend workflow contract validation for tag format, permission, concurrency, and release-before-alias ordering in `scripts/validate-workflows.mjs`

## Phase 5: User Story 3 - Understand Marketplace enrollment

**Independent test**: Confirm maintainers can distinguish automated tag releases from the three manual Marketplace prerequisites in under two minutes.

- [x] T012 [US3] Document release usage, branch checks, and Marketplace manual prerequisites in `README.md`

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T013 Run formatting, typecheck, lint, tests, workflow validation, bundle/plugin validation, pack dry run, and audits from `specs/002-ci-action-releases/quickstart.md`
- [x] T014 Record validation evidence in `specs/002-ci-action-releases/verification.md`
- [x] T015 Complete lifecycle state in `specs/002-ci-action-releases/tasks.md` and `.sp/huddles/007-end-user-changelogs/huddle.md`

## Dependencies

- Setup → Foundational → US1 and US2; US3 can proceed after contracts; Polish follows all stories.
- T010 precedes T011. T005–T008 are parallel because they touch separate files.

## Implementation Strategy

The MVP is US1: stable, least-privilege CI and security checks. US2 adds safe consumer releases; US3 prevents inaccurate Marketplace expectations. Each story remains independently verifiable.
