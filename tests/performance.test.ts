import { it, expect } from "vitest";
import { render } from "../src/render/markdown.js";
import type { ChangeEntry } from "../src/domain/release.js";
it("renders 10,000 normalized entries within the generation budget", () => {
  const entries: ChangeEntry[] = Array.from(
    { length: 10000 },
    (_, position) => ({
      sourceHash: position.toString(16).padStart(40, "0"),
      category: position % 2 ? "fixed" : "added",
      summary: `User-visible change ${position}`,
      breaking: false,
      userVisible: true,
      position,
    }),
  );
  const start = performance.now();
  const artifact = render("large-release", entries);
  expect(performance.now() - start).toBeLessThan(10000);
  expect(artifact.entries).toHaveLength(10000);
});
