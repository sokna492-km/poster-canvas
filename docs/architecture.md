# Architecture

Poster Studio is a client-only React application. User code is **never** evaluated in the main window.

## Layers

| Layer    | Location             | Role                                                 |
| -------- | -------------------- | ---------------------------------------------------- |
| UI       | `src/components/`    | Editor shell, dialogs, toolbars                      |
| State    | `src/stores/`        | Zustand slices: editor, preview, project, ui, export |
| Compiler | `src/core/compiler/` | Pure string preprocess (imports, export default)     |
| Bridge   | `src/core/renderer/` | `postMessage` to sandbox iframe                      |
| Export   | `src/core/export/`   | `PosterExporter` → sandbox export                    |
| Sandbox  | `public/sandbox/`    | Babel compile + React render + html-to-image         |

## Data flow

1. User edits code → `editorStore.code` (marks preview stale; does not auto-render)
2. User clicks **Run** (or loads a project) → `usePreviewRender` runs `preprocess()` in the parent
3. Preprocessed script plus project `assets` / `logoSlot` sent to iframe via `SandboxBridge.render()` — or `clear()` on preprocess failure
4. Sandbox compiles with Babel (`React`, `PosterCore`, `assets` in scope), executes in an isolated document, optionally overlays the logo slot, posts diagnostics back
5. `previewStore` holds status, stale flag, and error markers for Monaco + status bar

Logo uploads live on `PosterProject.assets` (data URLs) and are not inlined into the editor buffer.

## Replaceable services

`configureApp()` in `src/lib/config.ts` injects:

- `ProjectRepository` — default: `LocalProjectRepository` (localStorage)
- `AuthProvider` — default: `MockAuthProvider`
- `apiBaseUrl` — optional future backend

## Security

- Parent app: no `eval` / `new Function` on user code
- Sandbox iframe: controlled environment with fixed `PosterCore` module
- Unsupported imports are stripped with warnings

## State stores

- **editorStore** — code buffer, dirty flag, run nonce
- **previewStore** — zoom, fit, grid, diagnostics, render status
- **projectStore** — active project, CRUD via repository
- **uiStore** — theme, modals, mobile tab
