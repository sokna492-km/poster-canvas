import type { ExportFormat } from "@/core/types";
import type { SandboxBridge } from "@/core/renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  children: React.ReactNode;
}

export function ExportMenu({ bridge, children }: ExportMenuProps) {
  const handleExport = (format: ExportFormat) => {
    if (!bridge) {
      toast.error("Preview not ready");
      return;
    }
    exportPoster(bridge, format);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {FORMATS.map(({ format, label }) => (
          <DropdownMenuItem key={format} onClick={() => handleExport(format)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
