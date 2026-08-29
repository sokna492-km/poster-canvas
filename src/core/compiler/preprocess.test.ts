import { describe, expect, it } from "vitest";
import { preprocess } from "./preprocess";

describe("preprocess", () => {
  it("strips react imports and rewrites export default", () => {
    const source = `import React from "react";
export default function Poster() {
  return <div>Hello</div>;
}`;
    const { code, diagnostics } = preprocess(source);
    expect(code).not.toContain("import");
    expect(code).toContain("const __default = function Poster");
    expect(diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
  });

  it("rewrites @poster/core imports", () => {
    const source = `import { Poster, Text } from "@poster/core";
export default function Poster() {
  return <Poster><Text>Hi</Text></Poster>;
}`;
    const { code } = preprocess(source);
    expect(code).toContain("const { Poster, Text } = PosterCore");
  });

  it("warns on unsupported imports", () => {
    const source = `import foo from "lodash";
export default function Poster() { return null; }`;
    const { diagnostics } = preprocess(source);
    expect(diagnostics.some((d) => d.kind === "preprocess" && d.severity === "warning")).toBe(true);
  });

  it("errors when no poster component is found", () => {
    const { diagnostics } = preprocess("const x = 1;");
    expect(diagnostics.some((d) => d.severity === "error")).toBe(true);
  });
});
