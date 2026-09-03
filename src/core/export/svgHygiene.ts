/**
 * Post-process dom2svg output into Illustrator-compatible SVG markup.
 */

export function sanitizeIllustratorSvg(svgMarkup: string, width: number, height: number): string {
  let svg = svgMarkup.trim();
  if (!svg) throw new Error("Empty SVG markup");

  // Strip scripts and foreignObject (Illustrator-hostile).
  svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
  svg = svg.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "");

  if (!/^<\?xml/i.test(svg)) {
    svg = `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`;
  }

  svg = svg.replace(/<svg\b([^>]*)>/i, (_full, attrs: string) => {
    let next = attrs;
    if (!/\bxmlns\s*=/.test(next)) {
      next += ` xmlns="http://www.w3.org/2000/svg"`;
    }
    if (!/\bxmlns:xlink\s*=/.test(next)) {
      next += ` xmlns:xlink="http://www.w3.org/1999/xlink"`;
    }
    if (!/\bwidth\s*=/.test(next)) {
      next += ` width="${width}"`;
    } else {
      next = next.replace(/\bwidth\s*=\s*"[^"]*"/i, `width="${width}"`);
    }
    if (!/\bheight\s*=/.test(next)) {
      next += ` height="${height}"`;
    } else {
      next = next.replace(/\bheight\s*=\s*"[^"]*"/i, `height="${height}"`);
    }
    if (!/\bviewBox\s*=/.test(next)) {
      next += ` viewBox="0 0 ${width} ${height}"`;
    }
    return `<svg${next}>`;
  });

  return svg;
}

export function svgContainsForeignObject(svgMarkup: string): boolean {
  return /<foreignObject\b/i.test(svgMarkup);
}
