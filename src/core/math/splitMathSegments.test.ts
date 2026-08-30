import { describe, expect, it } from "vitest";
import { splitMathSegments } from "./splitMathSegments";

describe("splitMathSegments", () => {
  it("returns plain text unchanged", () => {
    expect(splitMathSegments("hello world")).toEqual([{ type: "text", value: "hello world" }]);
  });

  it("parses inline $...$", () => {
    expect(splitMathSegments("before $x^2$ after")).toEqual([
      { type: "text", value: "before " },
      { type: "math", value: "x^2", display: false },
      { type: "text", value: " after" },
    ]);
  });

  it("parses display $$...$$", () => {
    expect(splitMathSegments("$$\\int x$$")).toEqual([
      { type: "math", value: "\\int x", display: true },
    ]);
  });

  it("parses \\[...\\] and \\(...\\)", () => {
    expect(splitMathSegments("a \\[b\\] c \\(d\\) e")).toEqual([
      { type: "text", value: "a " },
      { type: "math", value: "b", display: true },
      { type: "text", value: " c " },
      { type: "math", value: "d", display: false },
      { type: "text", value: " e" },
    ]);
  });

  it("leaves lone dollar prices as text", () => {
    expect(splitMathSegments("Only $50 today")).toEqual([
      { type: "text", value: "Only $50 today" },
    ]);
  });

  it("unescapes \\$ in text and ignores escaped delimiters", () => {
    expect(splitMathSegments("cost \\$50 and $x$")).toEqual([
      { type: "text", value: "cost $50 and " },
      { type: "math", value: "x", display: false },
    ]);
  });

  it("prefers $$ over single $", () => {
    expect(splitMathSegments("$$a$$ and $b$")).toEqual([
      { type: "math", value: "a", display: true },
      { type: "text", value: " and " },
      { type: "math", value: "b", display: false },
    ]);
  });
});
