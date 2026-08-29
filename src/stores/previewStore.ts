import { create } from "zustand";
import type { Diagnostic, RenderStatus } from "@/core/types";
import { clampZoom } from "@/data/sizes";
import { readStoredTheme, type ThemeMode } from "@/lib/theme";

export type PreviewBackground = "dark" | "light" | "checker";

interface PreviewState {
  zoom: number;
  fitMode: boolean;
  fitScale: number;
  showGrid: boolean;
  background: PreviewBackground;
  status: RenderStatus;
  diagnostics: Diagnostic[];
  /** True when editor code changed since the last Run attempt. */
  previewStale: boolean;
  reloadNonce: number;
  setZoom: (zoom: number) => void;
  zoomBy: (factor: number) => void;
  setFitMode: (fit: boolean) => void;
  setFitScale: (scale: number) => void;
  toggleGrid: () => void;
  cycleBackground: () => void;
  setStatus: (status: RenderStatus) => void;
  setDiagnostics: (diagnostics: Diagnostic[]) => void;
  setPreviewStale: (stale: boolean) => void;
  reloadSandbox: () => void;
}

const BACKGROUNDS: PreviewBackground[] = ["dark", "light", "checker"];

export const usePreviewStore = create<PreviewState>((set, get) => ({
  zoom: 1,
  fitMode: true,
  fitScale: 1,
  showGrid: true,
  background: readStoredTheme(),
  status: "idle",
  diagnostics: [],
  previewStale: false,
  reloadNonce: 0,
  setZoom: (zoom) => set({ zoom: clampZoom(zoom), fitMode: false }),
  zoomBy: (factor) => {
    const current = get().fitMode ? get().fitScale : get().zoom;
    set({ zoom: clampZoom(current * factor), fitMode: false });
  },
  setFitMode: (fitMode) => set({ fitMode }),
  setFitScale: (fitScale) => set({ fitScale }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  cycleBackground: () =>
    set((s) => ({
      background: BACKGROUNDS[(BACKGROUNDS.indexOf(s.background) + 1) % BACKGROUNDS.length]!,
    })),
  setStatus: (status) => set({ status }),
  setDiagnostics: (diagnostics) => set({ diagnostics }),
  setPreviewStale: (previewStale) => set({ previewStale }),
  reloadSandbox: () => set((s) => ({ reloadNonce: s.reloadNonce + 1, status: "idle" })),
}));

export function syncPreviewBackgroundWithTheme(theme: ThemeMode): void {
  const { background } = usePreviewStore.getState();
  if (background !== "checker") {
    usePreviewStore.setState({ background: theme });
  }
}

export function effectiveScale(state: Pick<PreviewState, "fitMode" | "fitScale" | "zoom">): number {
  return state.fitMode ? state.fitScale : state.zoom;
}
