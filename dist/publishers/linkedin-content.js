export function projectLinkedIn(a, max = 3000) {
    const text = a.markdown
        .split("\n")
        .filter((l) => !l.startsWith("<!--"))
        .map((l) => l.replace(/^#{2,3}\s*/, "").replace(/^- /, "• "))
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    if (text.length > max)
        throw new Error(`LinkedIn content exceeds ${max} characters`);
    return text;
}
