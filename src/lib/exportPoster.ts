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
  try {
    await exporter.exportAndDownload({ format, scale }, current?.name);
    toast.success(`Exported ${format.toUpperCase()}`);
  } catch (err) {
    toast.error(String(err));
  }
}
