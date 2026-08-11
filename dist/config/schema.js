import path from "node:path";
export function parseBoolean(value, fallback) { if (value === undefined || value === "")
    return fallback; const v = value.trim().toLowerCase(); if (v !== "true" && v !== "false")
    throw new Error(`Invalid boolean: ${value}`); return v === "true"; }
export function validateRequest(r, root = process.cwd()) { if (!r.from || !r.to || !r.identity.trim())
    throw new Error("from, to, and title are required"); const resolved = path.resolve(root, r.changelogPath); if (resolved !== root && !resolved.startsWith(root + path.sep))
    throw new Error("Changelog path must remain inside repository"); if (r.s3.enabled && (!r.s3.bucket || !r.s3.key))
    throw new Error("S3 bucket and key are required when enabled"); if (r.linkedin.enabled && (!r.linkedin.author || !r.linkedin.accessToken))
    throw new Error("LinkedIn author and token are required when enabled"); }
