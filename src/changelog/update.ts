import fs from "node:fs/promises";
import path from "node:path";
import type { ReleaseArtifact } from "../domain/release.js";
export async function updateChangelog(
  root: string,
  relative: string,
  a: ReleaseArtifact,
) {
  const file = path.resolve(root, relative);
  if (file !== root && !file.startsWith(root + path.sep))
    throw new Error("Path escapes repository");
  let old = "";
  try {
    old = await fs.readFile(file, "utf8");
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  }
  const start = a.markdown.split("\n")[0],
    end = a.markdown.split("\n").at(-1)!;
  const si = old.indexOf(start),
    ei = old.indexOf(end);
  let next;
  if (si < 0 !== ei < 0) throw new Error("Malformed managed changelog markers");
  if (si >= 0)
    next = old.slice(0, si) + a.markdown + old.slice(ei + end.length);
  else if (old) next = old.replace(/^(# .+\r?\n)/, "$1\n" + a.markdown + "\n");
  else next = `# Changelog\n\n${a.markdown}\n`;
  if (next === old) return false;
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = file + `.tmp-${process.pid}`;
  await fs.writeFile(tmp, next);
  await fs.rename(tmp, file);
  return true;
}
