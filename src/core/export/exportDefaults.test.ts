import { describe, expect, it } from "vitest";
import {
  DEFAULT_EXPORT_SCALE,
  DEFAULT_PDF_EXPORT_SCALE,
  clampExportScale,
  exportScaleForFormat,
  LOSSY_EXPORT_QUALITY,
  MAX_EXPORT_EDGE_PX,
  MAX_EXPORT_SCALE,
  MAX_PDF_EXPORT_BYTES,
  MAX_PDF_EXPORT_SCALE,
  MIN_EXPORT_BYTES,
  MIN_PDF_EXPORT_BYTES,
  PDF_EXPORT_QUALITY,
  PPTX_PX_PER_INCH,
} from "./exportDefaults";
import { dataUrlByteLength } from "./dataUrlBytes";
import { buildLayerPlan } from "./layerPlan";
import { sanitizeIllustratorSvg, svgContainsForeignObject } from "./svgHygiene";
import { buildSectionedCsv, hasPosterData } from "./posterDataExport";

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
  });

  it("picks scale by format", () => {
    expect(exportScaleForFormat("pdf")).toBe(DEFAULT_PDF_EXPORT_SCALE);
    expect(exportScaleForFormat("png")).toBe(DEFAULT_EXPORT_SCALE);
    expect(exportScaleForFormat("svg")).toBe(1);
    expect(exportScaleForFormat("csv")).toBe(1);
    expect(exportScaleForFormat("psd")).toBe(DEFAULT_EXPORT_SCALE);
  });

  it("clamps scale for large print artboards", () => {
    expect(MAX_EXPORT_EDGE_PX).toBe(8192);
    // A3 long edge 4961 → max scale 1
    expect(clampExportScale(3, 3508, 4961)).toBe(1);
    expect(clampExportScale(3, 1080, 1080)).toBe(3);
    expect(PPTX_PX_PER_INCH).toBe(96);
  });
});

describe("layerPlan", () => {
  it("returns bottom-to-top: background, content, marked, logo", () => {
    const plan = buildLayerPlan({
      hasBackground: true,
      hasContent: true,
      marked: [
        { id: "a", name: "Title", type: "text", order: 0, isLogo: false },
        { id: "b", name: "Logo", type: "logo", order: 1, isLogo: true },
      ],
    });
    expect(plan.map((p) => p.type)).toEqual(["background", "content", "text", "logo"]);
  });

  it("skips poster container type among marked", () => {
    const plan = buildLayerPlan({
      hasBackground: false,
      hasContent: true,
      marked: [
        { id: "p", name: "Poster", type: "poster", order: 0, isLogo: false },
        { id: "t", name: "Title", type: "text", order: 1, isLogo: false },
      ],
    });
    expect(plan.map((p) => p.type)).toEqual(["content", "text"]);
  });
});

describe("svgHygiene", () => {
  it("strips foreignObject and sets viewBox", () => {
    const raw = `<svg><foreignObject><div>x</div></foreignObject><rect width="10" height="10"/></svg>`;
    const out = sanitizeIllustratorSvg(raw, 100, 200);
    expect(svgContainsForeignObject(out)).toBe(false);
    expect(out).toContain('viewBox="0 0 100 200"');
    expect(out).toContain("xmlns=");
  });
});

describe("posterDataExport", () => {
  it("builds sectioned CSV", () => {
    const csv = buildSectionedCsv({
      metrics: [{ label: "Revenue", value: "1250000", delta: "8.2%" }],
      tables: [
        { name: "Table 1", columns: ["Category", "Amount"], rows: [["Marketing", "120000"]] },
      ],
    });
    expect(csv).toContain("section,label,value,delta");
    expect(csv).toContain("Metrics,Revenue,1250000,8.2%");
    expect(csv).toContain("Table 1,Marketing,120000");
    expect(hasPosterData({ metrics: [], tables: [] })).toBe(false);
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
