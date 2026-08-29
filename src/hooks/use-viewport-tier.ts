import { useSyncExternalStore } from "react";

/** Tailwind `md` */
export const VIEWPORT_MD = 768;
/** Tailwind `lg` */
export const VIEWPORT_LG = 1024;

export type ViewportTier = "small" | "medium" | "large";

function tierFromWidth(width: number): ViewportTier {
  if (width < VIEWPORT_MD) return "small";
  if (width < VIEWPORT_LG) return "medium";
  return "large";
}

function getServerSnapshot(): ViewportTier {
  // Prefer large for SSR so large desktop markup matches the common case;
  // client snapshot corrects immediately via useSyncExternalStore.
  return "large";
}

function getClientSnapshot(): ViewportTier {
  return tierFromWidth(window.innerWidth);
}

function subscribe(onStoreChange: () => void): () => void {
  const md = window.matchMedia(`(max-width: ${VIEWPORT_MD - 1}px)`);
  const lg = window.matchMedia(`(max-width: ${VIEWPORT_LG - 1}px)`);
  md.addEventListener("change", onStoreChange);
  lg.addEventListener("change", onStoreChange);
  window.addEventListener("resize", onStoreChange);
  return () => {
    md.removeEventListener("change", onStoreChange);
    lg.removeEventListener("change", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

/** Hydration-safe viewport tier: small &lt;768, medium 768–1023, large ≥1024. */
export function useViewportTier(): ViewportTier {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

/** @deprecated Prefer useViewportTier — kept for any residual imports. */
export function useIsMobile(): boolean {
  return useViewportTier() === "small";
}
