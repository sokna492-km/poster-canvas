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
        useEditorStore.getState().run();
        return;
      }

      if (key === "p") {
        event.preventDefault();
        useUiStore.getState().setCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
