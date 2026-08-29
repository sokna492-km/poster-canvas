# Integration

Poster Studio is designed to embed inside larger products (e.g. [krumath.com](https://krumath.com)).

## Configuration

```typescript
import { configureApp } from "@/lib/config";

configureApp({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  authProvider: {
    async getCurrentUser() {
      /* ... */
    },
    async login() {
      /* ... */
    },
    async logout() {
      /* ... */
    },
  },
  projectRepository: {
    async getProjects() {
      /* ... */
    },
    async getProject(id) {
      /* ... */
    },
    async createProject(p) {
      /* ... */
    },
    async updateProject(p) {
      /* ... */
    },
    async deleteProject(id) {
      /* ... */
    },
  },
});
```

Call `configureApp()` once before rendering `<PosterStudio />`.

## Project model

```typescript
interface PosterProject {
  id: string;
  name: string;
  code: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
  assets?: { logo?: { dataUrl: string; fileName: string; mimeType: string } };
  logoSlot?: {
    corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    maxHeight: number;
    padding: number;
  } | null;
}
```

Maps 1:1 to a future database record. Older records without `assets` / `logoSlot` are normalized on read.

## Code repository (future)

`CodeRepository` in `src/core/types/index.ts` is reserved for GitHub/remote code sources. The MVP uses local storage only.

## Environment

| Variable            | Description                                |
| ------------------- | ------------------------------------------ |
| `VITE_API_BASE_URL` | Optional API base for future backend calls |
| `VITE_BASE_PATH`    | App URL prefix. Defaults to `/poster-canvas`. Set to `/` for root deployment |

See `.env.example`.

## Subpath deployment

Poster Studio defaults to `/poster-canvas` (e.g. `https://krumath.com/poster-canvas` or `http://localhost:5173/poster-canvas`):

1. Keep or set `VITE_BASE_PATH=/poster-canvas` (this is the default; see `.env.example`).
2. Run `npm run build` and deploy the client output to your web server under that path.
3. Configure your host to serve the built `index.html` and assets for all routes under `/poster-canvas/*` (SPA fallback).

For root hosting, set `VITE_BASE_PATH=/` before building.
