/**
 * Convert an html-to-image `toSvg()` data URL into SVG markup.
 * Handles charset-utf-8 percent-encoded and base64 payloads; falls back to
 * the raw payload when `decodeURIComponent` would throw (malformed `%`).
 */
export function svgDataUrlToMarkup(dataUrl: string): string {
  const i = dataUrl.indexOf(",");
  if (i < 0) throw new Error("Invalid SVG data URL");
  const header = dataUrl.slice(0, i);
  const payload = dataUrl.slice(i + 1);
  if (/;base64/i.test(header)) {
    return atob(payload);
  }
  try {
    return decodeURIComponent(payload);
  } catch {
    return payload;
  }
}
