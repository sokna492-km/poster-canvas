import { create } from "zustand";
import { STARTER_CODE } from "@/data/templates";
import { usePreviewStore } from "@/stores/previewStore";

interface EditorState {
  code: string;
  dirty: boolean;
  /** Bumped to force a re-render of the preview (Run). */
  runNonce: number;
  setCode: (code: string) => void;
  /** Replaces the buffer without marking it dirty (project/template load). */
  resetCode: (code: string) => void;
  markSaved: () => void;
  run: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: STARTER_CODE,
  dirty: false,
  runNonce: 0,
  setCode: (code) => {
    usePreviewStore.getState().setPreviewStale(true);
    set({ code, dirty: true });
  },
  resetCode: (code) => {
    usePreviewStore.getState().setPreviewStale(false);
    set((s) => ({ code, dirty: false, runNonce: s.runNonce + 1 }));
  },
  markSaved: () => set({ dirty: false }),
  run: () => set((s) => ({ runNonce: s.runNonce + 1 })),
}));
