import * as core from "@actions/core";
import { run } from "../domain/run.js";
import { parseBoolean } from "../config/schema.js";
import { registerSecret, sanitize } from "../config/secrets.js";
async function main() { const token = core.getInput("linkedin-access-token"); if (token) {
    core.setSecret(token);
    registerSecret(token);
} try {
    const result = await run({ from: core.getInput("from", { required: true }), to: core.getInput("to") || "HEAD", identity: core.getInput("title", { required: true }), changelogPath: core.getInput("changelog-path") || "CHANGELOG.md", writeRepository: parseBoolean(core.getInput("write-repository"), true), s3: { enabled: parseBoolean(core.getInput("publish-s3"), false), bucket: core.getInput("s3-bucket"), key: core.getInput("s3-key"), region: core.getInput("s3-region"), endpoint: core.getInput("s3-endpoint"), forcePathStyle: parseBoolean(core.getInput("s3-force-path-style"), false) }, linkedin: { enabled: parseBoolean(core.getInput("publish-linkedin"), false), author: core.getInput("linkedin-author"), accessToken: token } });
    core.setOutput("markdown", result.artifact.markdown);
    core.setOutput("repository-changed", String(result.repositoryChanged));
    core.setOutput("content-digest", result.artifact.contentDigest);
    for (const d of result.destinations)
        core.setOutput(`${d.destination}-status`, d.status);
    if (!result.successful)
        core.setFailed("One or more enabled publishers failed");
}
catch (e) {
    core.setFailed(sanitize(e));
} }
void main();
