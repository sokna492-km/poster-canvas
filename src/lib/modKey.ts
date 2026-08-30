/** True on Apple platforms. SSR / unknown → false (Ctrl labels). */
export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const uaData = (
    navigator as Navigator & { userAgentData?: { platform?: string } }
  ).userAgentData;
  const platform = uaData?.platform ?? navigator.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

/** Modifier key glyph/label for the current platform. */
export function modKeyLabel(): string {
  return isApplePlatform() ? "⌘" : "Ctrl+";
}

/** Run shortcut label: `⌘↵` on Mac, `Ctrl+Enter` elsewhere. */
export function modEnterShortcut(): string {
  return isApplePlatform() ? "⌘↵" : "Ctrl+Enter";
}

/** Save shortcut label: `⌘S` on Mac, `Ctrl+S` elsewhere. */
export function modSShortcut(): string {
  return isApplePlatform() ? "⌘S" : "Ctrl+S";
}
