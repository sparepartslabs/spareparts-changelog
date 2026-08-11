import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const resolver = resolve("scripts/resolve-release-range.sh");

function git(directory: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd: directory, encoding: "utf8" }).trim();
}

function commit(directory: string, message: string): string {
  writeFileSync(resolve(directory, "change.txt"), `${message}\n`, {
    flag: "a",
  });
  git(directory, "add", "change.txt");
  git(directory, "commit", "-m", message);
  return git(directory, "rev-parse", "HEAD");
}

function fixture(): string {
  const directory = mkdtempSync(resolve(tmpdir(), "changelog-release-range-"));
  git(directory, "init", "--initial-branch=main");
  git(directory, "config", "user.email", "tests@example.com");
  git(directory, "config", "user.name", "Release Tests");
  return directory;
}

function range(directory: string, tag: string): Record<string, string> {
  const output = resolve(directory, "output.txt");
  execFileSync(resolver, [tag, output], { cwd: directory });
  return Object.fromEntries(
    readFileSync(output, "utf8")
      .trim()
      .split("\n")
      .map((line) => line.split("=", 2)),
  );
}

describe("release range", () => {
  it("selects the previous stable tag and ignores aliases and prereleases", () => {
    const directory = fixture();
    commit(directory, "feat: first");
    git(directory, "tag", "v0.1.0");
    git(directory, "tag", "v0");
    commit(directory, "feat: preview");
    git(directory, "tag", "v0.2.0-beta.1");
    commit(directory, "feat: current");
    git(directory, "tag", "v0.2.0");
    expect(range(directory, "v0.2.0")).toEqual({
      from: "v0.1.0",
      to: "v0.2.0",
    });
  });

  it("uses the root commit for the first non-empty release range", () => {
    const directory = fixture();
    const root = commit(directory, "feat: first");
    commit(directory, "fix: second");
    git(directory, "tag", "v0.1.0");
    expect(range(directory, "v0.1.0")).toEqual({ from: root, to: "v0.1.0" });
  });
});
