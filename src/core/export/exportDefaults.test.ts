import { describe, expect, it } from "vitest";
import {
  DEFAULT_EXPORT_SCALE,
  DEFAULT_PDF_EXPORT_SCALE,
  exportScaleForFormat,
  LOSSY_EXPORT_QUALITY,
  MAX_EXPORT_SCALE,
  MAX_PDF_EXPORT_BYTES,
  MAX_PDF_EXPORT_SCALE,
  MIN_EXPORT_BYTES,
  MIN_PDF_EXPORT_BYTES,
  PDF_EXPORT_QUALITY,
} from "./exportDefaults";
import { dataUrlByteLength } from "./dataUrlBytes";

describe("exportDefaults", () => {
  it("uses max-quality raster defaults", () => {
    expect(DEFAULT_EXPORT_SCALE).toBe(3);
    expect(MAX_EXPORT_SCALE).toBe(6);
    expect(MIN_EXPORT_BYTES).toBe(3 * 1024 * 1024);
    expect(LOSSY_EXPORT_QUALITY).toBe(1);
    expect(DEFAULT_EXPORT_SCALE).toBeLessThanOrEqual(MAX_EXPORT_SCALE);
  });

  it("targets a 3–5MB PDF quality band", () => {
    expect(DEFAULT_PDF_EXPORT_SCALE).toBe(4);
    expect(MAX_PDF_EXPORT_SCALE).toBe(5);
    expect(PDF_EXPORT_QUALITY).toBe(1);
    expect(MIN_PDF_EXPORT_BYTES).toBe(3 * 1024 * 1024);
    expect(MAX_PDF_EXPORT_BYTES).toBe(5 * 1024 * 1024);
    expect(DEFAULT_PDF_EXPORT_SCALE).toBeLessThanOrEqual(MAX_PDF_EXPORT_SCALE);
    expect(MIN_PDF_EXPORT_BYTES).toBeLessThan(MAX_PDF_EXPORT_BYTES);
  });

  it("picks scale by format", () => {
    expect(exportScaleForFormat("pdf")).toBe(DEFAULT_PDF_EXPORT_SCALE);
    expect(exportScaleForFormat("png")).toBe(DEFAULT_EXPORT_SCALE);
    expect(exportScaleForFormat("jpg")).toBe(DEFAULT_EXPORT_SCALE);
  });
});

describe("dataUrlByteLength", () => {
  it("estimates base64 payload size", () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5]);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    const dataUrl = `data:image/png;base64,${btoa(binary)}`;
    expect(dataUrlByteLength(dataUrl)).toBe(5);
  });

  it("uses decoded length for percent-encoded payloads", () => {
    const text = "hello world";
    const dataUrl = `data:text/plain,${encodeURIComponent(text)}`;
    expect(dataUrlByteLength(dataUrl)).toBe(text.length);
  });
});
