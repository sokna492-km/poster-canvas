import type { ExportFormat } from "@/core/types";
import { clampExportScale, exportScaleForFormat } from "@/core/export/exportDefaults";
import { SandboxExporter } from "@/core/export/sandboxExporter";
import type { SandboxBridge } from "@/core/renderer";
import { requireSignedInForAction } from "@/lib/requireSignedInForAction";
import { useProjectStore } from "@/stores/projectStore";
import { toast } from "sonner";

export async function exportPoster(
  bridge: SandboxBridge | null,
  format: ExportFormat,
): Promise<void> {
  if (!bridge) return;
  if ((await requireSignedInForAction()) === false) return;

  const current = useProjectStore.getState().current;
  const width = current?.width ?? 1080;
  const height = current?.height ?? 1080;
  const scale = clampExportScale(exportScaleForFormat(format), width, height);
  const exporter = new SandboxExporter(bridge);
  const postHostLog = (hypothesisId: string, location: string, message: string, data: unknown) => {
    // #region agent log
    const payload = {
      sessionId: "99918c",
      runId: "pre-fix",
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    };
    const body = JSON.stringify(payload);
    fetch("http://127.0.0.1:7406/ingest/a837067b-6229-492c-9bf2-1286c0a5726f", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "99918c" },
      body,
    }).catch(() => {});
    fetch(`${import.meta.env.BASE_URL}__agent_debug_log`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "99918c" },
      body,
    }).catch(() => {});
    // #endregion
  };
  try {
    const result = await exporter.exportAndDownload({ format, scale }, current?.name);
    postHostLog("F", "exportPoster.ts:success", "Host export succeeded", {
      format,
      scale,
      width,
      height,
      name: current?.name,
      mimeType: result.mimeType,
      dataLen: result.data?.length ?? 0,
      dataHead: String(result.data ?? "").slice(0, 120),
    });
    toast.success(`Exported ${format.toUpperCase()}`);
  } catch (err) {
    postHostLog("B", "exportPoster.ts:error", "Host export failed", {
      format,
      scale,
      error: String(err),
    });
    toast.error(String(err));
  }
}
