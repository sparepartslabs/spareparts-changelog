# Research: CI and Action Releases

## Decision: Test Node 20, 22, and 24

**Rationale**: Node 20 is the declared JavaScript Action runtime; 22 and 24 catch forward-compatibility issues across currently relevant maintained lines.  
**Alternatives considered**: Only Node 20 would miss upcoming runtime drift; 22/24 alone would not exercise the declared runtime.

## Decision: Validate a committed bundle by rebuilding and comparing bytes

**Rationale**: Action consumers execute `dist/action/index.js`, not TypeScript source, so source-only tests can pass while the distributed code is stale.  
**Alternatives considered**: Building only during release permits stale code to merge; committing no bundle is incompatible with direct JavaScript Action consumption.

## Decision: Create release before updating the floating major tag

**Rationale**: Consumers of `@v1` must never advance to a commit whose immutable GitHub release failed. A concurrency key prevents same-major races.  
**Alternatives considered**: Updating first can expose an unpublished release; updating all semver aliases broadens mutable state beyond the requested major alias.

## Decision: Keep Marketplace enrollment manual and documented

**Rationale**: GitHub requires initial owner acceptance of the Marketplace Developer Agreement, 2FA, and selection of the Marketplace checkbox when publishing the release. These enrollment steps are not a general API toggle.  
**Alternatives considered**: Claiming full Marketplace automation would be inaccurate; browser automation would be brittle and unsafe.

## Decision: Separate security checks

**Rationale**: Lockfile audit and secret detection have different failure modes and schedules. Independent stable checks improve branch protection and diagnosis.  
**Alternatives considered**: A monolithic security job obscures which control failed.
