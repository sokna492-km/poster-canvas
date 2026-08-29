import type { ExportRequest, ExportResult, PosterExporter } from "@/core/types";
import type { SandboxBridge } from "@/core/renderer";
import { downloadData, exportFileName } from "@/lib/download";
import { exportScaleForFormat } from "./exportDefaults";

export class SandboxExporter implements PosterExporter {
  constructor(private readonly bridge: SandboxBridge) {}

  async export(request: ExportRequest): Promise<ExportResult> {
    const requestId = crypto.randomUUID();
    const result = await this.bridge.export({
      format: request.format,
      scale: request.scale ?? exportScaleForFormat(request.format),
      requestId,
    });

    const fileName = request.fileName ?? exportFileName("poster", request.format);

    return {
      format: result.format,
      data: result.data,
      mimeType: result.mimeType,
      fileName,
    };
  }

  async exportAndDownload(request: ExportRequest, projectName?: string): Promise<ExportResult> {
    const fileName = request.fileName ?? exportFileName(projectName ?? "poster", request.format);
    const result = await this.export({ ...request, fileName });
    downloadData(result.data, result.fileName, result.mimeType);
    return result;
  }
}
