import { useEffect, useState } from "react";
import { SandboxBridge } from "@/core/renderer";
import { usePreviewStore } from "@/stores/previewStore";
import { useEditorStore } from "@/stores/editorStore";

export function useSandboxBridge(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
): SandboxBridge | null {
  const reloadNonce = usePreviewStore((s) => s.reloadNonce);
  const [bridge, setBridge] = useState<SandboxBridge | null>(null);

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
    setBridge(instance);

    return () => {
      instance.destroy();
      setBridge(null);
    };
  }, [reloadNonce]);

  useEffect(() => {
    if (bridge && iframeRef.current) {
      bridge.attach(iframeRef.current);
    }
  }, [bridge, iframeRef]);

  return bridge;
}
