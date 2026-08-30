import { useEffect } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";

export function useKeyboardShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;

      const key = event.key.toLowerCase();

      if (key === "s") {
        event.preventDefault();
        void useProjectStore.getState().saveProject();
        return;
      }

      if (key === "enter") {
        event.preventDefault();
        event.stopPropagation();
        useEditorStore.getState().run();
        return;
      }

      if (key === "p") {
        event.preventDefault();
        useUiStore.getState().setCommandPaletteOpen(true);
      }
    };

    // Capture: Monaco handles Ctrl/Cmd+Enter internally (insert line) and never
    // lets the event bubble to window.
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);
}
