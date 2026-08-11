import { validateRequest } from "../config/schema.js";
import { readHistory } from "../git/history.js";
import { generateChanges } from "../ai/generator.js";
import { render } from "../render/markdown.js";
import { updateChangelog } from "../changelog/update.js";
import { S3Publisher } from "../publishers/s3.js";
import { LinkedInPublisher } from "../publishers/linkedin.js";
export async function run(request, deps = {}) {
    const root = deps.root ?? process.cwd();
    validateRequest(request, root);
    const { entries, omitted } = await generateChanges(await readHistory(request.from, request.to, root), request.ai, deps.aiFetch);
    const artifact = render(request.identity, entries, omitted);
    const destinations = [];
    let repositoryChanged = false;
    if (request.writeRepository) {
        repositoryChanged = await updateChangelog(root, request.changelogPath, artifact);
        destinations.push({
            destination: "repository",
            status: repositoryChanged ? "succeeded" : "unchanged",
            location: request.changelogPath,
            message: repositoryChanged ? "Updated" : "Unchanged",
        });
    }
    else
        destinations.push({
            destination: "repository",
            status: "skipped",
            message: "Disabled",
        });
    if (request.s3.enabled)
        destinations.push(await new S3Publisher(request.s3, deps.s3Client).publish(artifact));
    else
        destinations.push({
            destination: "s3",
            status: "skipped",
            message: "Disabled",
        });
    if (request.linkedin.enabled)
        destinations.push(await new LinkedInPublisher(request.linkedin, deps.fetch).publish(artifact));
    else
        destinations.push({
            destination: "linkedin",
            status: "skipped",
            message: "Disabled",
        });
    return {
        artifact,
        repositoryChanged,
        destinations,
        successful: !destinations.some((d) => d.status === "failed"),
    };
}
