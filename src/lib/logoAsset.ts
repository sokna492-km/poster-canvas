import type { PosterLogoAsset } from "@/core/types";

export const LOGO_MAX_FILE_BYTES = 2 * 1024 * 1024;
export const LOGO_MAX_EDGE_PX = 1600;

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
]);

function normalizeMime(file: File): string {
  const type = (file.type || "").toLowerCase();
  if (type === "image/jpg") return "image/jpeg";
  return type;
}

function mimeFromName(fileName: string): string | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return null;
}

export function assertLogoFile(file: File): string {
  if (file.size > LOGO_MAX_FILE_BYTES) {
    throw new Error("Logo must be 2MB or smaller.");
  }
  let mime = normalizeMime(file);
  if (!mime || !ALLOWED_MIME.has(mime)) {
    mime = mimeFromName(file.name) ?? "";
  }
  if (!ALLOWED_MIME.has(mime) && mime !== "image/jpg") {
    throw new Error("Use PNG, JPEG, WebP, or SVG.");
  }
  return mime === "image/jpg" ? "image/jpeg" : mime;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read logo file."));
    };
    reader.onerror = () => reject(new Error("Could not read logo file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode logo image."));
    img.src = dataUrl;
  });
}

async function rasterToPngDataUrl(file: File): Promise<string> {
  const raw = await readAsDataUrl(file);
  const img = await loadImage(raw);
  const longest = Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height);
  const scale = longest > LOGO_MAX_EDGE_PX ? LOGO_MAX_EDGE_PX / longest : 1;
  const width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
  const height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process logo image.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}

/**
 * Validate and encode a logo file as a project asset (data URL).
 * SVG is kept as-is; rasters are downscaled and stored as PNG.
 */
export async function fileToLogoAsset(file: File): Promise<PosterLogoAsset> {
  const mimeType = assertLogoFile(file);

  if (mimeType === "image/svg+xml") {
    const dataUrl = await readAsDataUrl(file);
    return { dataUrl, fileName: file.name, mimeType };
  }

  const dataUrl = await rasterToPngDataUrl(file);
  return {
    dataUrl,
    fileName: file.name.replace(/\.(jpe?g|webp)$/i, ".png"),
    mimeType: "image/png",
  };
}
