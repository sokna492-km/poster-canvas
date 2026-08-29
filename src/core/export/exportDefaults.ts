import type { ExportFormat } from "@/core/types";

/** Default pixel ratio for raster export (CSS px × scale). */
export const DEFAULT_EXPORT_SCALE = 3;

/** Default pixel ratio for PDF export (JPEG-embedded, size-banded). */
export const DEFAULT_PDF_EXPORT_SCALE = 4;

/** Upper bound when scaling up PNG/JPG/WebP to meet the minimum file size. */
export const MAX_EXPORT_SCALE = 6;

/** Upper bound when scaling up PDF toward the minimum file size. */
export const MAX_PDF_EXPORT_SCALE = 5;

/** Minimum decoded payload size for PNG/JPG/WebP exports. */
export const MIN_EXPORT_BYTES = 3 * 1024 * 1024;

/** Soft floor for PDF exports — scale up until met (or max PDF scale). */
export const MIN_PDF_EXPORT_BYTES = 3 * 1024 * 1024;

/** Soft ceiling for PDF exports — scale down until under (or scale 1). */
export const MAX_PDF_EXPORT_BYTES = 5 * 1024 * 1024;

/** Browser-max quality for JPEG / WebP raster exports. */
export const LOSSY_EXPORT_QUALITY = 1;

/** JPEG quality when embedding raster into PDF (browser max for clarity). */
export const PDF_EXPORT_QUALITY = 1;

/** Scale to send for a given export format. */
export function exportScaleForFormat(format: ExportFormat): number {
  return format === "pdf" ? DEFAULT_PDF_EXPORT_SCALE : DEFAULT_EXPORT_SCALE;
}
