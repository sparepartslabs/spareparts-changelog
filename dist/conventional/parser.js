import { CommitParser } from "conventional-commits-parser";
const parser = new CommitParser();
export function parseCommit(c) { const p = parser.parse(`${c.subject}\n\n${c.body}`); const fallback = /^[a-z]+(?:\([^)]*\))?!?:\s*(.+)$/i.exec(c.subject); const subject = p.subject ?? fallback?.[1]; if (!subject)
    return null; const breaking = Boolean(/^[a-z]+(?:\([^)]*\))?!:/i.test(c.subject) || p.notes?.some(n => n.title.toLowerCase().includes("breaking"))); return { sourceHash: c.hash, category: "changed", summary: subject.trim(), scope: p.scope ?? undefined, breaking, userVisible: true, position: c.position }; }
