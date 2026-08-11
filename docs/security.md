# Security

Publisher credentials are caller-owned, transient, masked, and never serialized. Prefer GitHub OIDC-derived AWS credentials. LinkedIn tokens belong in GitHub secrets or the local environment. Errors pass through centralized redaction; tests use canary secrets. The dependency tree is checked with npm audit; vulnerable transitive HTTP clients are pinned through package overrides until their parent dependency catches up. Report vulnerabilities privately to the repository maintainers.
