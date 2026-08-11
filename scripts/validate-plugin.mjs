import { execFileSync } from "node:child_process";
import { accessSync, constants, readFileSync } from "node:fs";
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

const pluginRoot = resolve(repositoryRoot, "plugin");
const manifest = JSON.parse(
  readFileSync(resolve(pluginRoot, ".codex-plugin/plugin.json"), "utf8"),
);

if (manifest.name !== "spareparts-changelog") {
  throw new Error("plugin manifest name must be spareparts-changelog");
}
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version)) {
  throw new Error("plugin manifest version must be semantic");
}
for (const relative of ["README.md", "skills/changelog/SKILL.md"]) {
  accessSync(resolve(pluginRoot, relative), constants.R_OK);
}

const skill = readFileSync(
  resolve(pluginRoot, "skills/changelog/SKILL.md"),
  "utf8",
);
if (!skill.startsWith("---\n") || !/^name:\s*\S+/m.test(skill)) {
  throw new Error("changelog skill must contain YAML frontmatter and a name");
}
if (/\[TODO:|<TODO>|PLACEHOLDER/i.test(skill)) {
  throw new Error("changelog skill contains a placeholder");
}

function exists(file) {
  try {
    accessSync(file, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

if (exists(skillValidator) && exists(pluginValidator)) {
  execFileSync(
    "python3",
    [skillValidator, resolve(pluginRoot, "skills/changelog")],
    {
      cwd: repositoryRoot,
      stdio: "inherit",
    },
  );
  execFileSync("python3", [pluginValidator, pluginRoot], {
    cwd: repositoryRoot,
    stdio: "inherit",
  });
} else {
  process.stdout.write(
    "Official Codex validators unavailable; self-contained plugin checks passed.\n",
  );
}
