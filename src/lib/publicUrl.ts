/** Join a public asset path onto Vite's `BASE_URL` (includes trailing slash). */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path.replace(/^\//, "")}`;
}
