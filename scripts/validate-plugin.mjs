import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const codexRoot = process.env.CODEX_HOME
  ? resolve(process.env.CODEX_HOME)
  : resolve(homedir(), ".codex");

const skillValidator = resolve(
  codexRoot,
  "skills/.system/skill-creator/scripts/quick_validate.py",
);
const pluginValidator = resolve(
  codexRoot,
  "skills/.system/plugin-creator/scripts/validate_plugin.py",
);

execFileSync("python3", [skillValidator, resolve(repositoryRoot, "plugin/skills/changelog")], {
  cwd: repositoryRoot,
  stdio: "inherit",
});
execFileSync("python3", [pluginValidator, resolve(repositoryRoot, "plugin")], {
  cwd: repositoryRoot,
  stdio: "inherit",
});
