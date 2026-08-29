import { describe, expect, it } from "vitest";
import { svgDataUrlToMarkup } from "./svgDataUrl";

describe("svgDataUrlToMarkup", () => {
  it("decodes charset=utf-8 percent-encoded payloads", () => {
    const markup = '<svg xmlns="http://www.w3.org/2000/svg"><text>hi</text></svg>';
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
    expect(svgDataUrlToMarkup(dataUrl)).toBe(markup);
  });

  it("decodes base64 payloads", () => {
    const markup = '<svg xmlns="http://www.w3.org/2000/svg"/>';
    const dataUrl = `data:image/svg+xml;base64,${btoa(markup)}`;
    expect(svgDataUrlToMarkup(dataUrl)).toBe(markup);
  });

  it("does not throw on malformed percent sequences", () => {
    const payload = "<svg>100% off</svg>";
    const dataUrl = `data:image/svg+xml;charset=utf-8,${payload}`;
    expect(() => svgDataUrlToMarkup(dataUrl)).not.toThrow();
    expect(svgDataUrlToMarkup(dataUrl)).toBe(payload);
  });

  it("throws when the data URL has no comma", () => {
    expect(() => svgDataUrlToMarkup("not-a-data-url")).toThrow("Invalid SVG data URL");
  });
});
