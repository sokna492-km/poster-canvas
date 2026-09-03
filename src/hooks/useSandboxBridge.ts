import { useCallback, useEffect, useRef, useState } from "react";
import { SandboxBridge } from "@/core/renderer";
import { usePreviewStore } from "@/stores/previewStore";
import { useEditorStore } from "@/stores/editorStore";

/**
 * Owns the sandbox bridge and attaches it whenever the preview iframe mounts.
 * Mobile Code/Preview tabs unmount the iframe; a callback ref re-attaches on show.
 */
export function useSandboxBridge(): {
  bridge: SandboxBridge | null;
  iframeRef: (node: HTMLIFrameElement | null) => void;
} {
  const reloadNonce = usePreviewStore((s) => s.reloadNonce);
  const [bridge, setBridge] = useState<SandboxBridge | null>(null);
  const bridgeRef = useRef<SandboxBridge | null>(null);
  const iframeNodeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const instance = new SandboxBridge({
      onReady: () => {
        usePreviewStore.getState().setStatus("idle");
        useEditorStore.getState().run();
      },
      onRendered: () => {
        usePreviewStore.getState().setStatus("ready");
        usePreviewStore.getState().setDiagnostics([]);
        usePreviewStore.getState().setPreviewStale(false);
      },
      onCompileError: (diagnostic) => {
        usePreviewStore.getState().setStatus("error");
        usePreviewStore.getState().setDiagnostics([diagnostic]);
        usePreviewStore.getState().setPreviewStale(false);
      },
      onRuntimeError: (diagnostic) => {
        usePreviewStore.getState().setStatus("error");
        usePreviewStore.getState().setDiagnostics([diagnostic]);
        usePreviewStore.getState().setPreviewStale(false);
      },
    });
    bridgeRef.current = instance;
    setBridge(instance);

    if (iframeNodeRef.current) {
      instance.attach(iframeNodeRef.current);
    }

    return () => {
      instance.destroy();
      bridgeRef.current = null;
      setBridge(null);
    };
  }, [reloadNonce]);

  const iframeRef = useCallback((node: HTMLIFrameElement | null) => {
    iframeNodeRef.current = node;
    const current = bridgeRef.current;
    if (!current) return;
    if (node) {
      current.attach(node);
    } else {
      current.detach();
    }
  }, []);

  return { bridge, iframeRef };
}
