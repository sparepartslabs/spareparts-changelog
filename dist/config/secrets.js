const secrets = new Set();
export function registerSecret(value) { if (value)
    secrets.add(value); }
export function sanitize(value) { let text = value instanceof Error ? value.message : String(value); for (const secret of secrets)
    text = text.split(secret).join("***"); return text.replace(/Bearer\s+\S+/gi, "Bearer ***"); }
