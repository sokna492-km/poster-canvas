# Exporting

Export is implemented in the sandbox using [html-to-image](https://github.com/bubkoo/html-to-image) and [jsPDF](https://github.com/parallax/jsPDF) (PDF only).

## Formats

| Format | Notes |
| ------ | ----- |
| PNG | Default raster export at 3× scale (adaptive up to 6×) |
| JPG | White background, quality 1 (browser max) |
| WebP | Canvas `toDataURL` at quality 1 |
| SVG | Serialized SVG markup (safe data-URL decode; no scale loop) |
| PDF | JPEG (quality 1) at 4× scale; sized toward **3–5 MB** |

## Quality

- Default `scale` / `pixelRatio` for PNG/JPG/WebP is **3** (`DEFAULT_EXPORT_SCALE`).
- PDF starts at **4** (`DEFAULT_PDF_EXPORT_SCALE`) via `exportScaleForFormat()`.
- For PNG, JPG, and WebP, if the decoded payload is under **3 MB**, the sandbox retries at `scale + 1` up to **6**.
- For PDF: if under **3 MB**, scale up to **5**; if over **5 MB**, scale down to **1**. Still JPEG-embedded (not PNG), so files stay far below the old ~40 MB PNG PDFs.
- JPG / WebP use `quality: 1`. PDF embed uses `PDF_EXPORT_QUALITY` (1).
- SVG is vector markup and does not use the scale loops.

Constants live in `src/core/export/exportDefaults.ts` (mirrored in `public/sandbox/main.js`).

## Architecture

The UI calls `SandboxExporter` (`src/core/export/sandboxExporter.ts`), which implements `PosterExporter`:

```typescript
interface PosterExporter {
  export(request: ExportRequest): Promise<ExportResult>;
}
```

The exporter sends `{ type: "export", format, scale, requestId }` to the sandbox and resolves when `export-done` arrives. Export timeout is 120 seconds to allow large high-DPI captures.

A future backend renderer can implement the same interface without changing UI code.

## Download

`exportAndDownload()` triggers a browser download via a temporary `<a>` element (`src/lib/download.ts`).

## Keyboard / palette

- Command palette: Export PNG, Export SVG, Export PDF
- Toolbar: **Export** dropdown
