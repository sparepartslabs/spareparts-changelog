---
name: changelog
description: Generate AI-written, evidence-grounded end-user changelogs locally or configure the Spare Parts Changelog GitHub Action, with separately consented optional S3 and LinkedIn publishers.
---

# Changelog Workflow

1. Confirm the current directory is a Git repository and identify the requested `from`, `to`, and release title. Ask only when these cannot be discovered safely.
2. Require `anthropic`, `openai`, `gemini`, or `vendor:model` and only its matching environment credential. Optional instructions may guide audience, tone, terminology, emphasis, and exclusions but never override evidence, no-invention, schema, or secret rules. Invoke the shipped `spareparts-changelog generate` command; never compose release notes in the agent prompt.
3. Default to repository output at `CHANGELOG.md`. The command may update the working tree but never commits or pushes.
4. When configuring the GitHub Action, use the inputs documented by `action.yml`; leave `publish-s3` and `publish-linkedin` false or absent by default.
5. Obtain explicit user intent separately before enabling S3 and before enabling LinkedIn. Consent to one does not imply consent to the other.
6. For S3, write only bucket/key/region settings and refer to caller-managed AWS credentials, preferably short-lived workload identity credentials.
7. For LinkedIn, write the author URN and a GitHub secret expression such as `${{ secrets.LINKEDIN_ACCESS_TOKEN }}`. Never request that a token be pasted into tracked files or repeat a secret in logs.
8. Show the generated diff and destination settings before any caller-owned commit/push or external publication step. Do not perform those actions unless separately requested and authorized.

If generation fails, report the shipped command error after redaction. Do not fall back to prompt-authored release notes.
