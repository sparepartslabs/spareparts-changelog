import * as core from "@actions/core";
import { run } from "../domain/run.js";
import { parseBoolean } from "../config/schema.js";
import { registerSecret, sanitize } from "../config/secrets.js";
async function main() {
  const secret = (name: string) => {
    const value = core.getInput(name);
    if (value) {
      core.setSecret(value);
      registerSecret(value);
    }
    return value || undefined;
  };
  const anthropicApiKey = secret("anthropic-api-key"),
    openaiApiKey = secret("openai-api-key"),
    geminiApiKey = secret("gemini-api-key"),
    token = secret("linkedin-access-token");
  try {
    const result = await run({
      from: core.getInput("from", { required: true }),
      to: core.getInput("to") || "HEAD",
      identity: core.getInput("title", { required: true }),
      changelogPath: core.getInput("changelog-path") || "CHANGELOG.md",
      writeRepository: parseBoolean(core.getInput("write-repository"), true),
      ai: {
        provider: core.getInput("provider", { required: true }),
        instructions: core.getInput("instructions") || undefined,
        anthropicApiKey,
        openaiApiKey,
        geminiApiKey,
      },
      s3: {
        enabled: parseBoolean(core.getInput("publish-s3"), false),
        bucket: core.getInput("s3-bucket"),
        key: core.getInput("s3-key"),
        region: core.getInput("s3-region"),
        endpoint: core.getInput("s3-endpoint"),
        forcePathStyle: parseBoolean(
          core.getInput("s3-force-path-style"),
          false,
        ),
      },
      linkedin: {
        enabled: parseBoolean(core.getInput("publish-linkedin"), false),
        author: core.getInput("linkedin-author"),
        accessToken: token,
      },
    });
    core.setOutput("markdown", result.artifact.markdown);
    core.setOutput("repository-changed", String(result.repositoryChanged));
    core.setOutput("content-digest", result.artifact.contentDigest);
    for (const d of result.destinations)
      core.setOutput(`${d.destination}-status`, d.status);
    if (!result.successful)
      core.setFailed("One or more enabled publishers failed");
  } catch (e) {
    core.setFailed(sanitize(e));
  }
}
void main();
