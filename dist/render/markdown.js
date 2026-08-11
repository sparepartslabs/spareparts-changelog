import { createHash } from "node:crypto";
const order = [
    "breaking",
    "added",
    "fixed",
    "improved",
    "changed",
    "removed",
    "security",
];
const labels = {
    breaking: "Breaking Changes",
    added: "Added",
    fixed: "Fixed",
    improved: "Improved",
    changed: "Changed",
    removed: "Removed",
    security: "Security",
};
const esc = (s) => s
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/<!--/g, "&lt;!--")
    .trim();
export function render(identity, entries, omittedCount = 0) {
    const key = createHash("sha256").update(identity).digest("hex").slice(0, 16);
    const lines = [
        `<!-- spareparts-changelog:start:${key} -->`,
        `## ${esc(identity)}`,
        "",
    ];
    for (const cat of order) {
        const list = entries
            .filter((e) => e.category === cat)
            .sort((a, b) => a.position - b.position || a.sourceHash.localeCompare(b.sourceHash));
        if (list.length) {
            lines.push(`### ${labels[cat]}`, "", ...list.map((e) => `- ${esc(e.summary)}`), "");
        }
    }
    if (!entries.length)
        lines.push("_No user-visible changes._", "");
    lines.push(`<!-- spareparts-changelog:end:${key} -->`);
    const markdown = lines.join("\n");
    return {
        identity,
        entries,
        omittedCount,
        markdown,
        contentDigest: createHash("sha256").update(markdown).digest("hex"),
    };
}
