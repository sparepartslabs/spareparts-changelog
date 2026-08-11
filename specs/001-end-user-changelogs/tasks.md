# Tasks: End-User Changelogs

**Input**: Design documents from `/specs/001-end-user-changelogs/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Included because the specification requires deterministic, idempotent, destination-isolated, failure, and secret-safety verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes distinct files and has no dependency on an incomplete task in the same phase
- **[Story]**: Maps the task to one independently testable user story

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the package, build, quality, and test structure.

- [X] T001 Initialize Node 20 TypeScript package metadata, CLI binary, build scripts, and runtime dependencies in `package.json`
- [X] T002 Configure TypeScript source and distribution targets in `tsconfig.json`
- [X] T003 [P] Configure Vitest projects, coverage, and fixture timeouts in `vitest.config.ts`
- [X] T004 [P] Configure linting and formatting rules in `eslint.config.js` and `.prettierrc.json`
- [X] T005 [P] Create source, test, distribution, and plugin directory placeholders documented in `specs/001-end-user-changelogs/plan.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared types, validation, safe diagnostics, and orchestration boundaries used by every story.

**⚠️ CRITICAL**: No user story implementation begins until this phase is complete.

- [X] T006 [P] Define ReleaseRequest, RevisionRange, SourceCommit, ChangeEntry, ReleaseArtifact, and category types in `src/domain/release.ts`
- [X] T007 [P] Define DestinationConfiguration, DestinationResult, RunResult, and Publisher interfaces in `src/domain/result.ts` and `src/publishers/publisher.ts`
- [X] T008 [P] Implement repository-path, release-input, and conditional publisher validation schemas in `src/config/schema.ts`
- [X] T009 [P] Implement centralized secret registration, masking, and error sanitization in `src/config/secrets.ts`
- [X] T010 Implement render-once destination orchestration with independent result collection and fatal enabled-destination failures in `src/domain/run.ts`
- [X] T011 [P] Add validation contract tests for defaults, contained paths, booleans, and conditional publisher requirements in `tests/contract/config.test.ts`
- [X] T012 [P] Add canary-secret unit tests for sanitizer and result serialization in `tests/security/secrets.test.ts`

**Checkpoint**: Shared contracts compile and foundation tests pass.

---

## Phase 3: User Story 1 - Maintain a Repository Changelog (Priority: P1) 🎯 MVP

**Goal**: Deterministically turn an explicit Conventional Commit range into end-user Markdown and idempotently update `CHANGELOG.md` without network, commit, or push behavior.

**Independent Test**: Generate a known fixture release, repeat it 100 times, and verify byte-identical Markdown, one managed section, preserved surrounding content, accurate changed state, and no external or Git publication side effects.

### Tests for User Story 1

- [X] T013 [P] [US1] Add Conventional Commit parser/category fixtures for scopes, bodies, breaking footers, reverts, merge commits, maintenance-only commits, and Markdown characters in `tests/unit/conventional.test.ts`
- [X] T014 [P] [US1] Add deterministic Markdown snapshots and 100-run equality checks in `tests/unit/render.test.ts`
- [X] T015 [P] [US1] Add changelog create/insert/replace/unchanged/malformed-marker/path-escape tests in `tests/unit/changelog-update.test.ts`
- [X] T016 [P] [US1] Add disposable-repository CLI integration fixtures and no-commit/no-push assertions in `tests/integration/local-generation.test.ts`

### Implementation for User Story 1

- [X] T017 [P] [US1] Implement delimiter-safe explicit revision-range history reading in `src/git/history.ts`
- [X] T018 [P] [US1] Implement Conventional Commit parsing and normalized entry extraction in `src/conventional/parser.ts`
- [X] T019 [US1] Implement fixed end-user category mapping, omission rules, breaking-change elevation, and stable entry ordering in `src/conventional/categorizer.ts`
- [X] T020 [US1] Implement canonical Markdown rendering, whitespace normalization, stable markers, and digest generation in `src/render/markdown.ts`
- [X] T021 [US1] Implement contained-path validation, existing-line-ending preservation, managed-section insertion/replacement, and atomic file writes in `src/changelog/update.ts`
- [X] T022 [US1] Implement `generate` argument parsing, defaults, safe summary/Markdown/JSON output, and documented exit codes in `src/cli/main.ts`
- [X] T023 [US1] Wire history, parsing, rendering, and default repository output into the shared runner in `src/domain/run.ts`

**Checkpoint**: The default local changelog workflow is a complete independently usable MVP.

---

## Phase 4: User Story 2 - Use Changelog Generation in Automation (Priority: P2)

**Goal**: Package the core as a reusable GitHub Action with explicit inputs and outputs while leaving commit and push policy to the caller.

**Independent Test**: Invoke the packaged action in a disposable consumer repository and verify contract outputs, changed/unchanged behavior, disabled publishers, and untouched Git history/remotes.

### Tests for User Story 2

- [X] T024 [P] [US2] Add action metadata input/default/output contract assertions in `tests/contract/action-metadata.test.ts`
- [X] T025 [P] [US2] Add action input normalization, output, failure, and no-commit/no-push tests in `tests/unit/action.test.ts`
- [X] T026 [P] [US2] Add packaged-action consumer smoke workflow fixture in `tests/integration/action-consumer/action.yml`

### Implementation for User Story 2

- [X] T027 [US2] Implement GitHub Action input validation, secret masking, runner output mapping, and failure reporting in `src/action/main.ts`
- [X] T028 [US2] Declare the complete non-pushing Action interface and Node 20 runtime in `action.yml`
- [X] T029 [US2] Configure reproducible action bundling and license inclusion in `package.json` and `scripts/build-action.mjs`
- [X] T030 [US2] Generate and verify the committed action runtime artifact in `dist/action/index.js`

**Checkpoint**: The reusable Action works with repository-only defaults and exposes all contracted outputs.

---

## Phase 5: User Story 3 - Publish to S3-Compatible Storage (Priority: P3)

**Goal**: Independently opt into publishing the unchanged rendered artifact to an explicit S3-compatible bucket/key using caller credentials.

**Independent Test**: Enable only S3 against an isolated fake/test endpoint and verify exact bytes/content type, environment credentials, unchanged repository behavior, attributable failures, and zero S3 calls while disabled.

### Tests for User Story 3

- [X] T031 [P] [US3] Add S3 disabled/configuration/credential/content-type/exact-byte/failure contract tests in `tests/contract/s3-publisher.test.ts`
- [X] T032 [P] [US3] Add CLI and Action S3-only integration tests with fake credentials and endpoint in `tests/integration/s3.test.ts`

### Implementation for User Story 3

- [X] T033 [US3] Implement standard credential-chain S3-compatible upload and sanitized results in `src/publishers/s3.ts`
- [X] T034 [US3] Wire S3 CLI flags and environment-owned credentials into destination configuration in `src/cli/main.ts`
- [X] T035 [US3] Wire S3 Action inputs, status output, and conditional validation into `src/action/main.ts` and `action.yml`
- [X] T036 [US3] Register S3 with independent adapter orchestration and fatal failure aggregation in `src/domain/run.ts`

**Checkpoint**: S3 is usable alone, remains off by default, and cannot change another destination.

---

## Phase 6: User Story 4 - Synchronize a LinkedIn Post (Priority: P4)

**Goal**: Independently opt into deterministic LinkedIn synchronization for an explicit author without leaking its token or silently truncating content.

**Independent Test**: Enable only LinkedIn with a fake service/author, verify deterministic projection and one request; verify disabled, oversize, invalid-token, and redaction behavior.

### Tests for User Story 4

- [X] T037 [P] [US4] Add LinkedIn projection ordering, Markdown normalization, and content-limit tests in `tests/unit/linkedin-projection.test.ts`
- [X] T038 [P] [US4] Add LinkedIn disabled/configuration/auth/success/failure/redaction contract tests in `tests/contract/linkedin-publisher.test.ts`
- [X] T039 [P] [US4] Add mixed S3-success/LinkedIn-failure orchestration test in `tests/integration/mixed-publishers.test.ts`

### Implementation for User Story 4

- [X] T040 [US4] Implement deterministic social-post projection and explicit destination-limit rejection in `src/publishers/linkedin-content.ts`
- [X] T041 [US4] Implement author-scoped LinkedIn request handling and sanitized results in `src/publishers/linkedin.ts`
- [X] T042 [US4] Wire token environment input and author CLI flags into destination configuration in `src/cli/main.ts`
- [X] T043 [US4] Wire LinkedIn Action secret/author inputs, masking, status output, and conditional validation into `src/action/main.ts` and `action.yml`
- [X] T044 [US4] Register LinkedIn with independent adapter orchestration and complete mixed-destination reporting in `src/domain/run.ts`

**Checkpoint**: Both publishers can run separately or together with truthful per-destination results.

---

## Phase 7: User Story 5 - Configure Through an Agent (Priority: P5)

**Goal**: Distribute a Codex plugin that guides local and Action setup, delegates rendering to the CLI, and asks separately before enabling external destinations.

**Independent Test**: Install the plugin in a clean environment, request repository-only setup and local generation, then request each publisher separately; verify CLI delegation, explicit consent gates, and secret-reference-only files.

### Tests for User Story 5

- [X] T045 [P] [US5] Add plugin manifest/schema and packaged-file validation in `tests/contract/plugin-package.test.ts`
- [X] T046 [P] [US5] Add scripted plugin safety scenarios for default-disabled publishers, separate consent, CLI delegation, and secret leakage in `tests/integration/plugin-safety.test.ts`

### Implementation for User Story 5

- [X] T047 [P] [US5] Create Codex plugin identity, version, and packaged resource declarations in `plugin/.codex-plugin/plugin.json`
- [X] T048 [US5] Implement repository detection, local generation delegation, and Action configuration guidance in `plugin/skills/changelog/SKILL.md`
- [X] T049 [US5] Add separate explicit-intent gates and safe secret-reference guidance for S3 and LinkedIn in `plugin/skills/changelog/SKILL.md`
- [X] T050 [P] [US5] Document plugin installation, supported workflows, and agent-neutral CLI boundary in `plugin/README.md`

**Checkpoint**: Plugin setup is distributable and cannot bypass the product safety contracts.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Complete documentation, packaged verification, security, performance, and release readiness across stories.

- [X] T051 [P] Document CLI usage, default behavior, categories, idempotency, and exit codes in `README.md`
- [X] T052 [P] Add repository-only and caller-owned commit/push Action examples in `examples/repository-changelog.yml`
- [X] T053 [P] Add OIDC-compatible S3 and secret-referenced LinkedIn Action examples in `examples/publishers.yml`
- [X] T054 Add 10,000-commit performance fixture and enforce the generation budget in `tests/integration/performance.test.ts`
- [X] T055 Run dependency audit and full canary-secret scan, recording remediation guidance in `docs/security.md`
- [X] T056 Run every scenario in `specs/001-end-user-changelogs/quickstart.md` and record final verification in `specs/001-end-user-changelogs/verification.md`
- [X] T057 Verify `dist/action/index.js` is reproducible from source and all package/action/plugin metadata reference the same release version in `scripts/verify-distribution.mjs`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup has no dependencies.
- Foundational depends on Setup and blocks every story.
- US1 depends on Foundational and delivers the MVP/core.
- US2 depends on US1 because the Action wraps the working core.
- US3 depends on Foundational plus the ReleaseArtifact/orchestrator completed by US1; it does not depend on US2.
- US4 depends on Foundational plus the ReleaseArtifact/orchestrator completed by US1; it does not depend on US2 or US3, though T039 validates their combined behavior.
- US5 depends on completed CLI and Action contracts (US1 and US2); publishers can be documented as disabled until US3/US4 land.
- Polish depends on every story included in the target release.

### User Story Graph

```text
Setup -> Foundation -> US1 (MVP) -> US2 -> US5
                         |          \
                         +-> US3     +-> Polish
                         +-> US4 ----+
```

### Parallel Opportunities

- T003–T005 can run in parallel after T001/T002 establish package choices.
- T006–T009 and their distinct-file tests T011–T012 can be developed in parallel before T010 integration.
- Within US1, T013–T018 cover distinct tests/components; categorization follows parsing, rendering follows categorization, and file/CLI integration follows rendering.
- US3 and US4 can run in parallel after US1; their unit/contract tests are parallel within each story.
- T024–T026, T031–T032, T037–T039, and T045–T046 are parallel test-writing groups.
- Documentation tasks T051–T053 can run in parallel after their corresponding contracts stabilize.

## Parallel Execution Examples

### US1

```text
T013 parser fixtures | T014 renderer snapshots | T015 updater tests | T016 repository integration
T017 Git reader      | T018 commit parser
```

### US2

```text
T024 metadata contract | T025 action unit contract | T026 consumer smoke fixture
```

### US3 and US4

```text
US3 contract/integration tests can proceed alongside US4 projection/contract tests after US1.
```

### US5

```text
T045 package validation | T046 safety scenarios | T047 manifest | T050 documentation
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundation.
2. Complete US1, including deterministic/idempotent tests and CLI integration.
3. Stop and validate the repository-only quickstart with no credentials or network.

### Incremental Delivery

1. Add US2 for reusable automation without changing Git policy.
2. Add US3 and US4 independently; validate every destination matrix combination.
3. Add US5 only after executable CLI/Action behavior is stable.
4. Complete cross-cutting security, performance, documentation, and distribution verification.

## Notes

- Tests precede their corresponding implementation and must fail for the intended reason first.
- A `[P]` task touches files distinct from other simultaneously eligible tasks; tasks sharing `src/domain/run.ts`, `src/cli/main.ts`, or `src/action/main.ts` remain sequential.
- No task authorizes committing, pushing, creating external credentials, or publishing to production destinations.
