import { useMemo } from "react";
import type { ExportFormat } from "@/core/types";
import { requestLogoUpload } from "@/components/logo/LogoControls";
import { modEnterShortcut, modSShortcut } from "@/lib/modKey";
import { useEditorStore } from "@/stores/editorStore";
import { usePreviewStore } from "@/stores/previewStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";

export interface PosterCommand {
  id: string;
  label: string;
  group: string;
  shortcut?: string;
  run: () => void | Promise<void>;
}

export function usePosterCommands(onExport?: (format: ExportFormat) => void): PosterCommand[] {
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setTemplatesOpen = useUiStore((s) => s.setTemplatesOpen);
  const setProjectsOpen = useUiStore((s) => s.setProjectsOpen);
  const setSizePickerOpen = useUiStore((s) => s.setSizePickerOpen);
  const setOnboardingOpen = useUiStore((s) => s.setOnboardingOpen);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const setFitMode = usePreviewStore((s) => s.setFitMode);
  const toggleGrid = usePreviewStore((s) => s.toggleGrid);
  const run = useEditorStore((s) => s.run);

  return useMemo(
    () => [
      {
        id: "new-project",
        label: "New Project",
        group: "Project",
        run: () => {
          setCommandPaletteOpen(false);
          void useProjectStore.getState().newProject();
        },
      },
      {
        id: "save-project",
        label: "Save Project",
        group: "Project",
        shortcut: modSShortcut(),
        run: () => {
          setCommandPaletteOpen(false);
          void useProjectStore.getState().saveProject();
        },
      },
      {
        id: "open-projects",
        label: "Open Project",
        group: "Project",
        run: () => {
          setCommandPaletteOpen(false);
          setProjectsOpen(true);
        },
      },
      {
        id: "run",
        label: "Run",
        group: "Editor",
        shortcut: modEnterShortcut(),
        run: () => {
          setCommandPaletteOpen(false);
          run();
        },
      },
      {
        id: "export-png",
        label: "Export PNG",
        group: "Export",
        run: () => {
          setCommandPaletteOpen(false);
          onExport?.("png");
        },
      },
      {
        id: "export-svg",
        label: "Export SVG",
        group: "Export",
        run: () => {
          setCommandPaletteOpen(false);
          onExport?.("svg");
        },
      },
      {
        id: "export-pdf",
        label: "Export PDF",
        group: "Export",
        run: () => {
          setCommandPaletteOpen(false);
          onExport?.("pdf");
        },
      },
      {
        id: "fit-preview",
        label: "Fit Preview",
        group: "Preview",
        run: () => {
          setCommandPaletteOpen(false);
          setFitMode(true);
        },
      },
      {
        id: "toggle-grid",
        label: "Toggle Grid",
        group: "Preview",
        run: () => {
          setCommandPaletteOpen(false);
          toggleGrid();
        },
      },
      {
        id: "open-templates",
        label: "Open Templates",
        group: "Templates",
        run: () => {
          setCommandPaletteOpen(false);
          setTemplatesOpen(true);
        },
      },
      {
        id: "change-size",
        label: "Change Poster Size",
        group: "Canvas",
        run: () => {
          setCommandPaletteOpen(false);
          setSizePickerOpen(true);
        },
      },
      {
        id: "add-logo",
        label: "Add Logo…",
        group: "Canvas",
        run: () => {
          setCommandPaletteOpen(false);
          void requestLogoUpload();
        },
      },
      {
        id: "show-onboarding",
        label: "Show how to use",
        group: "Help",
        run: () => {
          setCommandPaletteOpen(false);
          setOnboardingOpen(true);
        },
      },
      {
        id: "toggle-theme",
        label: "Theme",
        group: "View",
        run: () => {
          setCommandPaletteOpen(false);
          toggleTheme();
        },
      },
    ],
    [
      onExport,
      run,
      setCommandPaletteOpen,
      setFitMode,
      setOnboardingOpen,
      setProjectsOpen,
      setSizePickerOpen,
      setTemplatesOpen,
      toggleGrid,
      toggleTheme,
    ],
  );
}
