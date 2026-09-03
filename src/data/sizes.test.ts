import { describe, expect, it } from "vitest";
import { clampZoom, fitScale, findSizePreset, POSTER_SIZES } from "./sizes";

describe("sizes", () => {
  it("finds matching preset", () => {
    const preset = POSTER_SIZES[0]!;
    expect(findSizePreset(preset.width, preset.height)?.id).toBe(preset.id);
  });

  it("has unique ids and dimensions", () => {
    const ids = POSTER_SIZES.map((s) => s.id);
    const dims = POSTER_SIZES.map((s) => `${s.width}x${s.height}`);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(dims).size).toBe(dims.length);
  });

  it("includes new presets for prompt formats", () => {
    const ids = new Set(POSTER_SIZES.map((s) => s.id));
    for (const id of [
      "desktop",
      "laptop",
      "tablet",
      "phone",
      "open-graph",
      "letter-p",
      "letter-l",
      "slide-16-10",
    ]) {
      expect(ids.has(id)).toBe(true);
    }
    expect(POSTER_SIZES.find((s) => s.id === "landscape")?.label).toBe("HD 16:9");
  });

  it("fitScale never upscales past 1", () => {
    expect(fitScale({ width: 100, height: 100 }, { width: 2000, height: 2000 })).toBe(1);
  });

  it("fitScale scales down large posters", () => {
    const scale = fitScale({ width: 2000, height: 2000 }, { width: 500, height: 500 }, 0);
    expect(scale).toBeLessThan(1);
  });

  it("clampZoom bounds zoom", () => {
    expect(clampZoom(0.01)).toBe(0.05);
    expect(clampZoom(10)).toBe(4);
    expect(clampZoom(1)).toBe(1);
  });
});
