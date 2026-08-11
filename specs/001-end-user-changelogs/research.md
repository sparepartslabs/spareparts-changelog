# Research: End-User Changelogs

## Shared runtime

**Decision**: TypeScript targeting Node 20, with one package and a committed bundled action artifact.

**Rationale**: Native action support, strong shared contracts, cross-platform CLI, and no consumer-time install.

**Alternatives considered**: Composite shell is fragile cross-platform; containers constrain runners; separate implementations invite drift.

## History and parsing

**Decision**: Read the explicit `from..to` range through Git using unambiguous record delimiters, then use a maintained Conventional Commit parser for headers, bodies, footers, breaking markers, and reverts.

**Rationale**: Git owns revision semantics and a standards parser avoids unsafe subject-only regex parsing.

**Alternatives considered**: Provider APIs require network/incomplete history; bespoke traversal/parser increases correctness risk.

## Deterministic rendering and categories

**Decision**: Normalize to a stable model; fixed headings/order; traversal position then hash tie-break; normalized whitespace/line endings; no implicit dates/locales. Map `feat`→Added, `fix`→Fixed, `perf`→Improved, deprecation/removal/security appropriately, and elevate breaking changes. Omit maintenance-only types unless explicitly user-facing.

**Rationale**: Every variability source becomes explicit while output stays useful to customers.

**Alternatives considered**: AI rewriting is nondeterministic and may invent claims; raw commit types are developer-facing; including all commits adds noise.

## Idempotent file ownership

**Decision**: Surround each generated release with stable hidden markers derived from release identity; atomically replace a matching region or insert after title/preamble; preserve all bytes outside it and the existing line-ending style.

**Rationale**: Markers avoid ambiguous heading matches and protect user-owned content.

**Alternatives considered**: Always prepend duplicates; heading-only matching collides; owning the entire file violates preservation.

## Configuration

**Decision**: Explicit CLI/action inputs initially. Repository write defaults true to `CHANGELOG.md`; publishers default false; publisher settings validate only when enabled.

**Rationale**: Small auditable surface and offline operation without irrelevant credentials.

**Alternatives considered**: Environment-only input is undiscoverable; config files add precedence/migration scope.

## S3 publisher

**Decision**: Use the standard caller credential chain (including workload identity), require bucket/key when enabled, support region/custom endpoint/path style, and upload canonical UTF-8 Markdown as `text/markdown`.

**Rationale**: Supports AWS and compatible services without handling token exchange or long-lived keys.

**Alternatives considered**: Raw key inputs increase exposure; custom request signing duplicates security-sensitive work.

## LinkedIn publisher

**Decision**: Require explicit author URN and secret token. Deterministically project title/headings/bullets from the artifact; reject oversize content rather than silently truncate; never generatively rewrite.

**Rationale**: Social posts differ from Markdown files, while deterministic projection preserves truthfulness and reproducibility.

**Alternatives considered**: Raw Markdown is not portable; truncation can remove critical context; identity discovery broadens permissions.

## Orchestration and failure

**Decision**: Render once, optionally write, invoke every enabled adapter, collect independent results, and fail overall if any enabled publisher fails. Never claim rollback of an already completed side effect.

**Rationale**: External effects are not transactional; complete attributable reporting is accurate and actionable.

**Alternatives considered**: Fail-fast hides destination status; best-effort success violates contract; cross-service rollback is unreliable.

## Secrets and plugin

**Decision**: Central redaction, runner masking, no credential serialization, canary scanning. The Codex skill invokes the CLI, creates documented configuration, and asks separately before enabling each publisher.

**Rationale**: Defense in depth covers local/action errors, while executable generation remains testable outside prompts.

**Alternatives considered**: Runner masking alone misses local logs; prompt rendering or direct prompt publication bypasses deterministic/tested boundaries.
