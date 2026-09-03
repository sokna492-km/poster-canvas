/**
 * Sandbox export helpers (browser-only). Keep behavioral twins under src/core/export/.
 */

export const MAX_EXPORT_EDGE_PX = 8192;
export const DEFAULT_EXPORT_SCALE = 3;
export const DEFAULT_PDF_EXPORT_SCALE = 4;
export const MAX_EXPORT_SCALE = 6;
export const MAX_PDF_EXPORT_SCALE = 5;
export const MIN_EXPORT_BYTES = 3 * 1024 * 1024;
export const MIN_PDF_EXPORT_BYTES = 3 * 1024 * 1024;
export const MAX_PDF_EXPORT_BYTES = 5 * 1024 * 1024;
export const LOSSY_EXPORT_QUALITY = 1;
export const PDF_EXPORT_QUALITY = 1;
export const PPTX_PX_PER_INCH = 96;

export function clampExportScale(scale, posterWidth, posterHeight, maxEdgePx = MAX_EXPORT_EDGE_PX) {
  const edge = Math.max(posterWidth, posterHeight, 1);
  const maxScale = Math.max(1, Math.floor(maxEdgePx / edge));
  return Math.min(Math.max(1, Math.floor(scale)), maxScale);
}

export function exportScaleForFormat(format) {
  if (format === "pdf") return DEFAULT_PDF_EXPORT_SCALE;
  if (format === "svg" || format === "csv" || format === "xlsx") return 1;
  return DEFAULT_EXPORT_SCALE;
}

export function isRasterExportFormat(format) {
  return format === "png" || format === "jpg" || format === "webp";
}

export function sanitizeIllustratorSvg(svgMarkup, width, height) {
  let svg = String(svgMarkup || "").trim();
  if (!svg) throw new Error("Empty SVG markup");
  svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
  svg = svg.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "");
  if (!/^<\?xml/i.test(svg)) {
    svg = `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`;
  }
  svg = svg.replace(/<svg\b([^>]*)>/i, (_full, attrs) => {
    let next = attrs;
    if (!/\bxmlns\s*=/.test(next)) next += ` xmlns="http://www.w3.org/2000/svg"`;
    if (!/\bxmlns:xlink\s*=/.test(next)) next += ` xmlns:xlink="http://www.w3.org/1999/xlink"`;
    if (!/\bwidth\s*=/.test(next)) next += ` width="${width}"`;
    else next = next.replace(/\bwidth\s*=\s*"[^"]*"/i, `width="${width}"`);
    if (!/\bheight\s*=/.test(next)) next += ` height="${height}"`;
    else next = next.replace(/\bheight\s*=\s*"[^"]*"/i, `height="${height}"`);
    if (!/\bviewBox\s*=/.test(next)) next += ` viewBox="0 0 ${width} ${height}"`;
    return `<svg${next}>`;
  });
  return svg;
}

export function buildLayerPlan({ hasBackground, backgroundName, hasContent, marked }) {
  const plan = [];
  let seq = 0;
  if (hasBackground) {
    plan.push({
      id: "background",
      name: backgroundName ?? "Background",
      type: "background",
      order: seq++,
      isLogo: false,
      isBackground: true,
    });
  }
  if (hasContent) {
    plan.push({
      id: "content",
      name: "Content",
      type: "content",
      order: seq++,
      isLogo: false,
      isContent: true,
    });
  }
  const nonLogo = marked
    .filter((m) => !m.isLogo && m.type !== "poster")
    .slice()
    .sort((a, b) => a.order - b.order);
  for (const m of nonLogo) {
    plan.push({ id: m.id, name: m.name, type: m.type, order: seq++, isLogo: false, el: m.el });
  }
  const logos = marked
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
      el: m.el,
    });
  }
  return plan;
}

/** Layout wrappers — capturing these collapses the whole poster into one layer. */
export const CONTAINER_LAYER_TYPES = new Set(["poster", "box", "stack", "grid"]);

/**
 * Leaf marked nodes only (Text, Image, Logo, Shape, charts, …).
 * Nested leaves win over their marked parents.
 */
export function collectTopLevelMarked(root) {
  const all = Array.from(root.querySelectorAll("[data-poster-layer]"));
  const marked = [];
  let order = 0;
  for (const el of all) {
    const type = el.getAttribute("data-poster-layer") || "layer";
    if (CONTAINER_LAYER_TYPES.has(type)) continue;
    const nestedLeaf = Array.from(el.querySelectorAll("[data-poster-layer]")).some((child) => {
      const t = child.getAttribute("data-poster-layer");
      return t && !CONTAINER_LAYER_TYPES.has(t);
    });
    if (nestedLeaf) continue;
    marked.push({
      id: `layer-${order}`,
      name: el.getAttribute("data-poster-layer-name") || type,
      type,
      order: order++,
      isLogo: type === "logo",
      el,
    });
  }
  return marked;
}

/**
 * Fallback layer scanner for raw-HTML posters that have no @poster/core markers
 * (i.e. collectTopLevelMarked returns empty). Walks the visible DOM and treats:
 *   - <img> elements with a src → type "image"
 *   - elements whose direct children include a non-trivial text node → type "text"
 * Skips pointer-events:none (decorative overlays), hidden elements, and near-invisible
 * nodes (opacity < 0.3). Returns top-level candidates only — if an ancestor is already
 * a candidate its descendants are filtered out so layers don't nest.
 */
export function scanDomForLayers(root) {
  const candidates = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let el = walker.nextNode();
  while (el) {
    if (el !== root) {
      const style = getComputedStyle(el);
      const skip =
        style.display === "none" ||
        style.visibility === "hidden" ||
        parseFloat(style.opacity) < 0.3 ||
        style.pointerEvents === "none";
      if (!skip) {
        if (el.tagName === "IMG" && el.src) {
          candidates.push({ el, type: "image", name: el.alt || "Image" });
        } else {
          const hasDirectText = [...el.childNodes].some(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 2,
          );
          if (hasDirectText) {
            const text = (el.innerText || el.textContent || "").trim();
            if (text.length > 2)
              candidates.push({ el, type: "text", name: text.slice(0, 40) });
          }
        }
      }
    }
    el = walker.nextNode();
  }
  // Keep only top-level — filter out any element whose ancestor is already a candidate
  const elSet = new Set(candidates.map((c) => c.el));
  return candidates
    .filter((item) => {
      let p = item.el.parentElement;
      while (p && p !== root) {
        if (elSet.has(p)) return false;
        p = p.parentElement;
      }
      return true;
    })
    .map((item, i) => ({
      id: `dom-${i}`,
      name: item.name,
      type: item.type,
      order: i,
      isLogo: false,
      el: item.el,
    }));
}

export function detectSolidBackground(root) {
  const poster = root.querySelector("[data-poster-root]") || root.firstElementChild || root;
  const attr = poster.getAttribute?.("data-poster-background");
  if (attr && /^#|^rgb/i.test(attr)) return attr;
  const bg = getComputedStyle(poster).backgroundColor;
  if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return null;
  return bg;
}

export function parseMetricJson(raw) {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw);
    return {
      label: String(o.label ?? ""),
      value: String(o.value ?? ""),
      delta: String(o.delta ?? ""),
    };
  } catch {
    return null;
  }
}

export function parseTableJson(raw) {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw);
    return {
      columns: Array.isArray(o.columns) ? o.columns.map(String) : [],
      rows: Array.isArray(o.rows) ? o.rows.map((r) => (Array.isArray(r) ? r.map(String) : [])) : [],
    };
  } catch {
    return null;
  }
}

export function scrapePosterData(root) {
  const metrics = [];
  for (const el of root.querySelectorAll("[data-poster-metric]")) {
    const row = parseMetricJson(el.getAttribute("data-poster-metric"));
    if (row) metrics.push(row);
  }
  const tables = [];
  let ti = 0;
  for (const el of root.querySelectorAll("[data-poster-table]")) {
    const parsed = parseTableJson(el.getAttribute("data-poster-table"));
    if (!parsed) continue;
    ti += 1;
    tables.push({
      name: el.getAttribute("data-poster-layer-name") || `Table ${ti}`,
      columns: parsed.columns,
      rows: parsed.rows,
    });
  }
  if (!tables.length) {
    for (const table of root.querySelectorAll("table")) {
      if (table.hasAttribute("data-poster-table")) continue;
      const columns = Array.from(table.querySelectorAll("thead th")).map((th) =>
        th.textContent.trim(),
      );
      const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
        Array.from(tr.querySelectorAll("td")).map((td) => td.textContent.trim()),
      );
      if (!columns.length && !rows.length) continue;
      ti += 1;
      tables.push({ name: `Table ${ti}`, columns, rows });
    }
  }
  return { metrics, tables };
}

export function csvEscape(cell) {
  const s = String(cell ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function buildSectionedCsv(data) {
  const lines = [];
  if (data.metrics.length) {
    lines.push(["section", "label", "value", "delta"].map(csvEscape).join(","));
    for (const m of data.metrics) {
      lines.push(["Metrics", m.label, m.value, m.delta].map(csvEscape).join(","));
    }
  }
  data.tables.forEach((table, index) => {
    if (lines.length) lines.push("");
    const section = table.name || `Table ${index + 1}`;
    lines.push(["section", ...table.columns].map(csvEscape).join(","));
    for (const row of table.rows) {
      const padded = table.columns.map((_, i) => row[i] ?? "");
      lines.push([section, ...padded].map(csvEscape).join(","));
    }
  });
  return lines.join("\n") + (lines.length ? "\n" : "");
}

export function hasPosterData(data) {
  return data.metrics.length > 0 || data.tables.some((t) => t.columns.length || t.rows.length);
}

export function arrayBufferToBase64(buffer) {
  const bytes =
    buffer instanceof ArrayBuffer
      ? new Uint8Array(buffer)
      : new Uint8Array(buffer.buffer || buffer);
  const chunk = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    for (let j = 0; j < slice.length; j += 1) {
      binary += String.fromCharCode(slice[j]);
    }
  }
  return btoa(binary);
}



export function fillSolidCanvas(width, height, cssColor, scale) {
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = cssColor;
  ctx.fillRect(0, 0, w, h);
  return canvas;
}
