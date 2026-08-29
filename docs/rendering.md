# Rendering

## Preprocess (parent)

`preprocess()` in `src/core/compiler/preprocess.ts`:

- Removes React imports (provided by sandbox)
- Rewrites `@poster/core` → `PosterCore` destructuring
- Converts `export default` to `const __default = …`
- Emits diagnostics for unsupported imports or missing poster component

## Sandbox (iframe)

`public/sandbox/main.js`:

1. Receives `{ type: "render", code, width, height }`
2. Compiles with Babel (TSX + classic React runtime)
3. Executes via `new Function` **inside the iframe only**
4. Renders with React 18 + error boundary
5. Posts `rendered`, `compile-error`, or `runtime-error` to parent
6. Receives `{ type: "clear" }` to blank the poster (failed Run / empty code)

## Manual Run

`usePreviewRender` updates the preview only when:

- **Run** is clicked (or Cmd/Ctrl+Enter / command palette)
- A project or template is loaded
- The sandbox iframe becomes ready or is reloaded
- Canvas size, assets, or logo slot change

Typing in the editor does **not** auto-render. The Run button highlights when the preview is out of date.

## Preview controls

- **Fit** — scale poster to panel (never upscale past 100%)
- **Zoom** — manual scale 5%–400%
- **Grid** — overlay alignment grid
- **Background** — dark / light / checkerboard
- **Reload** — remount sandbox iframe

On preprocess, compile, or runtime errors, the poster is cleared and diagnostics appear in the StatusBar console (auto-expanded).
