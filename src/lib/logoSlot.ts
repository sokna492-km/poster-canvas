import type { PosterLogoSlot } from "@/core/types";

/** True when user JSX places `<Logo` — sandbox overlay must not also draw. */
export function codeUsesInlineLogo(code: string): boolean {
  return /<Logo[\s/>]/.test(code);
}

/**
 * Whether the sandbox should draw the logo overlay.
 * Inline `<Logo />` in user code wins so the mark is not duplicated.
 */
export function shouldUseLogoOverlay(
  code: string,
  logoSlot: PosterLogoSlot | null | undefined,
): boolean {
  if (!logoSlot) return false;
  return !codeUsesInlineLogo(code);
}

export const DEFAULT_LOGO_SLOT: PosterLogoSlot = {
  corner: "top-left",
  maxHeight: 64,
  padding: 40,
};
