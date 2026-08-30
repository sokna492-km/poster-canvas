import { create } from "zustand";
import { applyThemeToDocument, persistTheme, readStoredTheme, type ThemeMode } from "@/lib/theme";
import { syncPreviewBackgroundWithTheme } from "@/stores/previewStore";

export type { ThemeMode };

export type WorkspaceTab = "code" | "preview";

interface UiState {
  theme: ThemeMode;
  workspaceTab: WorkspaceTab;
  templatesOpen: boolean;
  projectsOpen: boolean;
  sizePickerOpen: boolean;
  commandPaletteOpen: boolean;
  consoleExpanded: boolean;
  onboardingOpen: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setWorkspaceTab: (tab: WorkspaceTab) => void;
  setTemplatesOpen: (open: boolean) => void;
  setProjectsOpen: (open: boolean) => void;
  setSizePickerOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setConsoleExpanded: (expanded: boolean) => void;
  setOnboardingOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  theme: readStoredTheme(),
  workspaceTab: "code",
  templatesOpen: false,
  projectsOpen: false,
  sizePickerOpen: false,
  commandPaletteOpen: false,
  consoleExpanded: false,
  onboardingOpen: false,
  setTheme: (theme) => {
    applyThemeToDocument(theme);
    persistTheme(theme);
    syncPreviewBackgroundWithTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    applyThemeToDocument(next);
    persistTheme(next);
    syncPreviewBackgroundWithTheme(next);
    set({ theme: next });
  },
  setWorkspaceTab: (workspaceTab) => set({ workspaceTab }),
  setTemplatesOpen: (templatesOpen) => set({ templatesOpen }),
  setProjectsOpen: (projectsOpen) => set({ projectsOpen }),
  setSizePickerOpen: (sizePickerOpen) => set({ sizePickerOpen }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setConsoleExpanded: (consoleExpanded) => set({ consoleExpanded }),
  setOnboardingOpen: (onboardingOpen) => set({ onboardingOpen }),
}));
