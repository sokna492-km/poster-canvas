import type { ExportFormat } from "@/core/types";
import type { SandboxBridge } from "@/core/renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WithTooltip } from "@/components/ui/tooltip";
import { exportPoster } from "@/lib/exportPoster";
import { toast } from "sonner";

const FORMATS: { format: ExportFormat; label: string }[] = [
  { format: "png", label: "PNG" },
  { format: "svg", label: "SVG" },
  { format: "pdf", label: "PDF" },
  { format: "jpg", label: "JPG" },
  { format: "webp", label: "WebP" },
];

interface ExportMenuProps {
  bridge: SandboxBridge | null;
  children: React.ReactElement;
}

export function ExportMenu({ bridge, children }: ExportMenuProps) {
  const handleExport = (format: ExportFormat) => {
    if (!bridge) {
      toast.error("Preview not ready");
      return;
    }
    void exportPoster(bridge, format);
  };

  return (
    <DropdownMenu>
      <WithTooltip label="Export">
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      </WithTooltip>
      <DropdownMenuContent align="end">
        {FORMATS.map(({ format, label }) => (
          <DropdownMenuItem key={format} onClick={() => void handleExport(format)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
