import { readFileSync } from "node:fs";
import process from "node:process";

const read = (file) => readFileSync(file, "utf8");
const requireText = (source, pattern, message) => {
  if (!pattern.test(source)) throw new Error(message);
};

const tests = read(".github/workflows/test.yml");
const distribution = read(".github/workflows/distribution.yml");
const dependency = read(".github/workflows/dependency-scan.yml");
const secrets = read(".github/workflows/secret-scan.yml");
const release = read(".github/workflows/release.yml");

for (const version of ["20", "22", "24"]) {
  requireText(
    tests,
    new RegExp(
      `node-version: \\[${version === "20" ? '\\"20\\", \\"22\\", \\"24\\"' : "[^\\]]+"}\\]`,
    ),
    "test matrix must cover Node 20, 22, and 24",
  );
}
requireText(
  tests,
  /name: Node \$\{\{ matrix\.node-version \}\}/,
  "matrix check name is unstable",
);
requireText(
  distribution,
  /name: committed artifacts/,
  "distribution check name is unstable",
);
requireText(dependency, /name: npm audit/, "dependency check name is unstable");
requireText(secrets, /name: trufflehog/, "secret check name is unstable");

for (const workflow of [tests, distribution, dependency]) {
  requireText(
    workflow,
    /permissions:\s*\n\s+contents: read/,
    "PR workflow must be read-only",
  );
}
requireText(
  secrets,
  /permissions:\s*\{\}/,
  "secret scan must have no default permissions",
);
requireText(release, /tags: \["v\*"\]/, "release must be tag-triggered");
requireText(
  release,
  /\^v\[0-9\]\+\\\.\[0-9\]\+\\\.\[0-9\]\+\$/,
  "release must reject non-stable tags",
);
requireText(
  release,
  /permissions:\s*\n\s+contents: write/,
  "release must declare contents write",
);
requireText(
  release,
  /id-token: write/,
  "release must request an OIDC identity token",
);
requireText(
  release,
  /uses: aws-actions\/configure-aws-credentials@v5/,
  "release must assume the changelog publisher role",
);
requireText(
  release,
  /s3-key: releases\/spareparts-changelog\/\$\{\{ steps\.changelog-object\.outputs\.version \}\}\.md/,
  "release must publish to its assigned stable S3 prefix",
);
requireText(
  release,
  /publish-s3: "true"/,
  "release must publish canonical notes to S3",
);
requireText(
  release,
  /--notes-file release-notes\.md/,
  "GitHub release must use canonical notes",
);
if (/--generate-notes/.test(release))
  throw new Error("release must not substitute GitHub-generated notes");
requireText(
  release,
  /concurrency:\s*\n\s+group: action-release/,
  "releases must serialize",
);
const create = release.indexOf("gh release create");
const alias = release.indexOf('git tag -f "$MAJOR"');
if (create < 0 || alias < 0 || alias < create) {
  throw new Error("release creation must precede major alias update");
}

process.stdout.write("Validated CI and release workflow contracts.\n");
