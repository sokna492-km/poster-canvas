import type { ExportFormat } from "@/core/types";
import { exportScaleForFormat } from "@/core/export/exportDefaults";
import { SandboxExporter } from "@/core/export/sandboxExporter";
import type { SandboxBridge } from "@/core/renderer";
import { useProjectStore } from "@/stores/projectStore";
import { toast } from "sonner";

export function exportPoster(bridge: SandboxBridge | null, format: ExportFormat): void {
  if (!bridge) return;
  const current = useProjectStore.getState().current;
  const exporter = new SandboxExporter(bridge);
  void exporter
    .exportAndDownload({ format, scale: exportScaleForFormat(format) }, current?.name)
    .then(() => toast.success(`Exported ${format.toUpperCase()}`))
    .catch((err) => {
      toast.error(String(err));
    });
}
