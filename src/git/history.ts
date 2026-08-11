import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { SourceCommit } from "../domain/release.js";
const run = promisify(execFile);
const RS = "\x1e",
  FS = "\x1f";
export async function readHistory(
  from: string,
  to: string,
  cwd = process.cwd(),
): Promise<SourceCommit[]> {
  const { stdout } = await run(
    "git",
    ["log", "--reverse", `--format=%H${FS}%s${FS}%b${RS}`, `${from}..${to}`],
    { cwd, maxBuffer: 50 * 1024 * 1024 },
  );
  return stdout
    .split(RS)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x, position) => {
      const [hash, subject, ...body] = x.split(FS);
      return { hash, subject, body: body.join(FS), position };
    });
}
