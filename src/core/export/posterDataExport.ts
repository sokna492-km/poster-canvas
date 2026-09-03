/**
 * Structured data extraction for CSV / XLSX exports.
 */

export interface MetricRow {
  label: string;
  value: string;
  delta: string;
}

export interface TableSheet {
  name: string;
  columns: string[];
  rows: string[][];
}

export interface PosterDataExport {
  metrics: MetricRow[];
  tables: TableSheet[];
}

export function parseMetricJson(raw: string | null | undefined): MetricRow | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as { label?: unknown; value?: unknown; delta?: unknown };
    return {
      label: String(o.label ?? ""),
      value: String(o.value ?? ""),
      delta: String(o.delta ?? ""),
    };
  } catch {
    return null;
  }
}

export function parseTableJson(
  raw: string | null | undefined,
): { columns: string[]; rows: string[][] } | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as { columns?: unknown; rows?: unknown };
    const columns = Array.isArray(o.columns) ? o.columns.map(String) : [];
    const rows = Array.isArray(o.rows)
      ? o.rows.map((r) => (Array.isArray(r) ? r.map(String) : []))
      : [];
    return { columns, rows };
  } catch {
    return null;
  }
}

export function csvEscape(cell: string): string {
  if (/[",\n\r]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
  return cell;
}

/** Sectioned CSV per plan guidance. */
export function buildSectionedCsv(data: PosterDataExport): string {
  const lines: string[] = [];

  if (data.metrics.length) {
    lines.push(["section", "label", "value", "delta"].map(csvEscape).join(","));
    for (const m of data.metrics) {
      lines.push(["Metrics", m.label, m.value, m.delta].map(csvEscape).join(","));
    }
  }

  data.tables.forEach((table, index) => {
    if (lines.length) lines.push("");
    const section = table.name || `Table ${index + 1}`;
    const header = ["section", ...table.columns];
    lines.push(header.map(csvEscape).join(","));
    for (const row of table.rows) {
      const padded = table.columns.map((_, i) => row[i] ?? "");
      lines.push([section, ...padded].map(csvEscape).join(","));
    }
  });

  return lines.join("\n") + (lines.length ? "\n" : "");
}

export function hasPosterData(data: PosterDataExport): boolean {
  return data.metrics.length > 0 || data.tables.some((t) => t.columns.length || t.rows.length);
}
