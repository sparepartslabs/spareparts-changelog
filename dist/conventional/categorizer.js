import { parseCommit } from "./parser.js";
const map = { feat: "added", fix: "fixed", perf: "improved", security: "security", deprecate: "changed", remove: "removed" };
export function categorize(commits) { let omitted = 0; const entries = []; for (const c of commits) {
    const e = parseCommit(c);
    const type = /^([a-z]+)(?:\([^)]*\))?!?:/.exec(c.subject)?.[1];
    const category = type ? map[type] : undefined;
    if (!e || !category) {
        omitted++;
        continue;
    }
    e.category = e.breaking ? "breaking" : category;
    entries.push(e);
} return { entries, omitted }; }
