import { describe, expect, it } from "vitest";
import {
  categorize,
  parseBoolean,
  projectLinkedIn,
  render,
  sanitize,
  updateChangelog,
} from "../src/index.js";

describe("public package surface", () => {
  it("exports the reusable deterministic API", () => {
    expect(categorize).toBeTypeOf("function");
    expect(render).toBeTypeOf("function");
    expect(updateChangelog).toBeTypeOf("function");
    expect(projectLinkedIn).toBeTypeOf("function");
    expect(parseBoolean).toBeTypeOf("function");
    expect(sanitize).toBeTypeOf("function");
  });
});
