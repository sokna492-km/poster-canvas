export const THEME_STORAGE_KEY = "poster-studio-theme";

export type ThemeMode = "dark" | "light";

export function readStoredTheme(): ThemeMode {
  if (typeof localStorage === "undefined") return "light";
  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function persistTheme(theme: ThemeMode): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyThemeToDocument(theme: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function monacoThemeFor(theme: ThemeMode): "vs-dark" | "vs-light" {
  return theme === "dark" ? "vs-dark" : "vs-light";
}
