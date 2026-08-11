# GitHub Action Contract

The root `action.yml` exposes a Node action operating in the checked-out repository. The consumer owns checkout credentials and any later commit/push.

## Inputs

| Input | Required | Default |
|---|---:|---|
| `from` | yes | — |
| `to` | no | `HEAD` |
| `title` | yes | — |
| `changelog-path` | no | `CHANGELOG.md` |
| `write-repository` | no | `true` |
| `publish-s3` | no | `false` |
| `s3-bucket`, `s3-key` | when S3 enabled | — |
| `s3-region`, `s3-endpoint`, `s3-force-path-style` | no | caller/service defaults |
| `publish-linkedin` | no | `false` |
| `linkedin-author`, `linkedin-access-token` | when LinkedIn enabled | — |

Booleans accept only explicit true/false after normalization. AWS credentials come from the runner environment, supporting upstream workload identity; the action has no raw AWS-key inputs.

## Outputs

`markdown`, `repository-changed`, `content-digest`, `repository-status`, `s3-status`, and `linkedin-status`. Status is `skipped`, `unchanged` where applicable, `succeeded`, or `failed`. Outputs contain no secrets or raw remote errors.

## Execution

Validate conditional inputs; read/parse range; render once; optionally update file; invoke each enabled publisher with the same artifact; set safe outputs; fail if generation, writing, or any enabled publisher fails. The action never commits or pushes.

| Repository | S3 | LinkedIn | Side effects |
|---:|---:|---:|---|
| on (default) | off | off | Changelog only |
| off | off | off | Render/outputs only |
| on/off | on | off | Repository as selected plus S3 |
| on/off | off | on | Repository as selected plus LinkedIn |
| on/off | on | on | Repository as selected plus both independent publishers |
