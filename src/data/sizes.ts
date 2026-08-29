import type { PosterSizePreset } from "@/core/types";

export const POSTER_SIZES: PosterSizePreset[] = [
  { id: "ig-portrait", label: "Instagram Portrait", group: "Social", width: 1080, height: 1350 },
  { id: "square", label: "Square", group: "Social", width: 1080, height: 1080 },
  { id: "story", label: "Story", group: "Social", width: 1080, height: 1920 },
  { id: "poster", label: "Poster", group: "Print", width: 1200, height: 1500 },
  { id: "landscape", label: "Landscape", group: "Screen", width: 1920, height: 1080 },
  { id: "a4-p", label: "A4 Portrait", group: "Print", width: 2480, height: 3508 },
  { id: "a4-l", label: "A4 Landscape", group: "Print", width: 3508, height: 2480 },
  { id: "a3-p", label: "A3 Portrait", group: "Print", width: 3508, height: 4961 },
  { id: "a3-l", label: "A3 Landscape", group: "Print", width: 4961, height: 3508 },
];

export const DEFAULT_SIZE = POSTER_SIZES.find((s) => s.id === "square") ?? POSTER_SIZES[0]!;

export function findSizePreset(width: number, height: number): PosterSizePreset | null {
  return POSTER_SIZES.find((s) => s.width === width && s.height === height) ?? null;
}

/** Scale factor that fits a poster inside a viewport, never upscaling past 1. */
export function fitScale(
  poster: { width: number; height: number },
  viewport: { width: number; height: number },
  padding = 48,
): number {
  const w = Math.max(viewport.width - padding, 1);
  const h = Math.max(viewport.height - padding, 1);
  if (poster.width <= 0 || poster.height <= 0) return 1;
  return Math.min(w / poster.width, h / poster.height, 1);
}

export function clampZoom(zoom: number): number {
  return Math.min(Math.max(zoom, 0.05), 4);
}
