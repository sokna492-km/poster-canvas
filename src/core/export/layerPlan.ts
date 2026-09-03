/**
 * Pure helpers for PSD layer planning (mirrored conceptually in the sandbox).
 * Array order is bottom-to-top compositing order.
 */

export interface LayerPlanItem {
  id: string;
  name: string;
  type: string;
  /** Document position hint; lower paints earlier (bottom). */
  order: number;
  /** True for logo layers that must stay topmost. */
  isLogo: boolean;
  /** Synthetic background plate (no DOM node). */
  isBackground?: boolean;
  /** Content capture with marked nodes hidden (holes model). */
  isContent?: boolean;
}

export interface MarkedLayerRef {
  id: string;
  name: string;
  type: string;
  /** document position / tree order index */
  order: number;
  isLogo: boolean;
}

/**
 * Build bottom-to-top plan:
 * Background → Content (unmarked holes) → marked non-logo (DOM order) → Logo.
 */
export function buildLayerPlan(options: {
  hasBackground: boolean;
  backgroundName?: string;
  hasContent: boolean;
  marked: MarkedLayerRef[];
}): LayerPlanItem[] {
  const plan: LayerPlanItem[] = [];
  let seq = 0;

  if (options.hasBackground) {
    plan.push({
      id: "background",
      name: options.backgroundName ?? "Background",
      type: "background",
      order: seq++,
      isLogo: false,
      isBackground: true,
    });
  }

  if (options.hasContent) {
    plan.push({
      id: "content",
      name: "Content",
      type: "content",
      order: seq++,
      isLogo: false,
      isContent: true,
    });
  }

  const nonLogo = options.marked
    .filter((m) => !m.isLogo && m.type !== "poster")
    .slice()
    .sort((a, b) => a.order - b.order);

  for (const m of nonLogo) {
    plan.push({
      id: m.id,
      name: m.name,
      type: m.type,
      order: seq++,
      isLogo: false,
    });
  }

  const logos = options.marked
    .filter((m) => m.isLogo)
    .slice()
    .sort((a, b) => a.order - b.order);

  for (const m of logos) {
    plan.push({
      id: m.id,
      name: m.name || "Logo",
      type: "logo",
      order: seq++,
      isLogo: true,
    });
  }

  return plan;
}

/** Top-level marked nodes: have data-poster-layer and no marked ancestor (except poster root). */
export function isTopLevelMarkedType(type: string | null | undefined): boolean {
  if (!type) return false;
  return type !== "poster";
}
