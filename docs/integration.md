# Integration

Poster Studio is designed to embed inside larger products (e.g. [krumath.com](https://krumath.com)). Soft-gate specifics for mounting under **krumath.com/poster-canvas** are below.

## KruMath soft gate (`/poster-canvas`)

Anyone may open the studio and edit. **Export** and **Add Logo** (upload/replace) require a signed-in, non-anonymous Supabase user. Otherwise the browser redirects to:

```text
/sign-in?returnUrl=/poster-canvas
```

- Session: same Supabase project and `.krumath.com` cookies as KruMath (not Firebase).
- Dev: the soft gate is skipped (`import.meta.env.DEV`) so local editing works without cookies.
- Deploy: Cloudflare Worker via Nitro (`npm run deploy`). Route `krumath.com/poster-canvas*` to the `poster-canvas` Worker (more specific than the main `krumath` Worker).

**Security note:** This soft gate is **client-side only**. It is not a hard server security boundary. Do not treat it as authorization for protected APIs or secrets.

### Operator checklist

```text
[ ] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY set at build time
[ ] npm run deploy → Worker name poster-canvas
[ ] Cloudflare route: krumath.com/poster-canvas* → poster-canvas
[ ] Smoke: signed-out can edit; Export/Add Logo → sign-in; after login actions work
[ ] Assets load from /poster-canvas/assets/...
[ ] Home card on krumath.com/home links to /poster-canvas (edit KruMath monorepo separately)
```

### KruMath home card (operator — separate PR)

In `apps/web/src/components/dashboard/GameSection.tsx`, add a card with `href: '/poster-canvas'` (same pattern as `RACER_HREF`). Do this **after** the Worker route works so the link is not dead.

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

| Variable                 | Description                                                                  |
| ------------------------ | ---------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`      | Optional API base for future backend calls                                   |
| `VITE_BASE_PATH`         | App URL prefix. Defaults to `/poster-canvas`. Set to `/` for root deployment |
| `VITE_SUPABASE_URL`      | Same as KruMath `NEXT_PUBLIC_SUPABASE_URL` (required for production gate)    |
| `VITE_SUPABASE_ANON_KEY` | Same as KruMath `NEXT_PUBLIC_SUPABASE_ANON_KEY`                              |
| `VITE_KRUMATH_ORIGIN`    | Optional local KruMath origin for sign-in / home redirects                   |

See `.env.example`.

## Subpath deployment

Poster Studio defaults to `/poster-canvas` (e.g. `https://krumath.com/poster-canvas` or `http://localhost:5173/poster-canvas`):

1. Keep or set `VITE_BASE_PATH=/poster-canvas` (this is the default; see `.env.example`).
2. Prefer `npm run deploy` (Nitro Cloudflare Worker) for production on krumath.com.
3. For static hosting instead: `npm run build` and serve client output under that path with SPA fallback for `/poster-canvas/*`.

For root hosting, set `VITE_BASE_PATH=/` before building.
