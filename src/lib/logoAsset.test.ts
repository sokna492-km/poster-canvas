import { describe, expect, it } from "vitest";
import { assertLogoFile, LOGO_MAX_FILE_BYTES, fileToLogoAsset } from "./logoAsset";

describe("assertLogoFile", () => {
  it("accepts png under the size limit", () => {
    const file = new File([new Uint8Array(16)], "logo.png", { type: "image/png" });
    expect(assertLogoFile(file)).toBe("image/png");
  });

  it("rejects oversized files", () => {
    const file = new File([new Uint8Array(LOGO_MAX_FILE_BYTES + 1)], "big.png", {
      type: "image/png",
    });
    expect(() => assertLogoFile(file)).toThrow(/2MB/);
  });

  it("rejects unsupported types", () => {
    const file = new File([new Uint8Array(8)], "logo.gif", { type: "image/gif" });
    expect(() => assertLogoFile(file)).toThrow(/PNG/);
  });

  it("infers mime from filename when type is empty", () => {
    const file = new File([new Uint8Array(8)], "mark.svg", { type: "" });
    expect(assertLogoFile(file)).toBe("image/svg+xml");
  });
});

describe("fileToLogoAsset", () => {
  it("keeps SVG as a data URL without rasterizing", async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>';
    const file = new File([svg], "mark.svg", { type: "image/svg+xml" });
    const asset = await fileToLogoAsset(file);
    expect(asset.mimeType).toBe("image/svg+xml");
    expect(asset.fileName).toBe("mark.svg");
    expect(asset.dataUrl).toMatch(/^data:image\/svg\+xml/);
  });
});
