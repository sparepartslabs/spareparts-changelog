# Feature Specification: CI and Action Releases

**Feature Branch**: `feat/end-user-changelogs`  
**Created**: 2026-08-11  
**Status**: Draft

## User Scenarios & Testing

### User Story 1 - Trust every proposed change (Priority: P1)

As a maintainer, I want pull requests and default-branch changes checked across every supported runtime so regressions, stale distributable files, invalid plugin metadata, vulnerable dependencies, and committed credentials cannot be merged unnoticed.

**Independent Test**: Open a pull request and confirm every documented check completes with stable names; intentionally stale the Action bundle or plugin metadata and confirm the relevant check fails.

### User Story 2 - Release a stable Action reference (Priority: P1)

As an Action consumer, I want validated version tags to create releases and update the matching major alias so I can pin either an immutable version or a maintained major line.

**Independent Test**: Run the workflow validation against a valid semantic version tag and verify release creation precedes the constrained major-alias update; invalid and prerelease tags must not move a major alias.

### User Story 3 - Understand Marketplace enrollment (Priority: P2)

As an organization owner, I want precise documentation separating automated tagged releases from GitHub Marketplace's initial manual enrollment so I do not expect CI to bypass agreement, 2FA, or UI requirements.

**Independent Test**: Follow the release documentation and verify it explicitly identifies the manual prerequisites and does not claim Marketplace listing is API-controlled.

## Requirements

### Functional Requirements

- **FR-001**: Pull requests and pushes to `main` MUST run tests and type validation on supported Node 20, 22, and 24 runtimes.
- **FR-002**: CI MUST expose stable check names suitable for branch protection.
- **FR-003**: CI MUST validate lint/formatting, the committed Action bundle, and the Codex plugin.
- **FR-004**: CI MUST scan dependency vulnerabilities and repository changes for secrets without receiving repository secrets.
- **FR-005**: Dependency update automation SHOULD cover npm packages and GitHub Actions weekly.
- **FR-006**: Releases MUST trigger only from full stable semantic version tags of the form `vMAJOR.MINOR.PATCH`.
- **FR-007**: A release MUST pass installation, tests, type/lint checks, bundle verification, plugin validation, and dependency audit before publishing.
- **FR-008**: Release automation MUST create a GitHub release and only then update the matching `vMAJOR` alias to the released commit.
- **FR-009**: Release automation MUST use least-privilege permissions and MUST NOT execute untrusted pull-request code with write credentials.
- **FR-010**: Documentation MUST state that initial Marketplace listing requires an organization owner's Developer Agreement acceptance, 2FA, and release-UI checkbox, and cannot be fully toggled via API.

## Edge Cases

- A malformed tag, prerelease tag, or tag whose package version differs is rejected before publication.
- A failed validation or GitHub release leaves the floating major alias unchanged.
- Concurrent releases for the same major line serialize rather than racing.
- A regenerated bundle that differs from committed bytes fails CI and instructs the contributor to commit it.

## Assumptions

- Node 20 remains the Action runtime declared in `action.yml`; Node 22 and 24 provide forward-compatibility coverage.
- Repository branch protection is configured separately after workflow check names exist.
- `spareparts-lgtm` is reference-only and is not modified by this feature.

## Success Criteria

- **SC-001**: 100% of pull requests report the documented branch-protection checks.
- **SC-002**: Stale Action output and invalid plugin packages are detected before merge in a single CI run.
- **SC-003**: A valid stable version tag produces one release and one matching major alias only after all validation succeeds.
- **SC-004**: No pull-request validation job receives write permission or repository secrets.
- **SC-005**: A maintainer can identify all manual Marketplace prerequisites from the repository documentation in under two minutes.
