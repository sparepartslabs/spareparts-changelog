# Quickstart: Validate CI and Releases

## Local CI parity

```sh
npm ci --ignore-scripts
npm run typecheck
npm run lint
npm run format:ci
npm test
npm run bundle:check
npm run plugin:validate
npm pack --dry-run
npm audit --omit=dev --audit-level=moderate
npm audit --audit-level=high
```

## Workflow inspection

Confirm workflows expose the exact names in [contracts/checks.md](contracts/checks.md), PR workflows have read-only permissions, and release steps match [contracts/release.md](contracts/release.md).

## Marketplace enrollment

Before the first Marketplace listing, an organization owner must accept GitHub's Marketplace Developer Agreement, have 2FA enabled, and select the Marketplace publication checkbox in the GitHub release UI. The tagged workflow creates releases and maintains the major Action tag; it does not perform those initial UI/account steps.
