import type { ReactElement } from "react";
import type { ExportFormat } from "@/core/types";
import type { SandboxBridge } from "@/core/renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WithTooltip } from "@/components/ui/tooltip";
import { exportPoster } from "@/lib/exportPoster";
import { toast } from "sonner";

const GROUPS: {
  label: string;
  formats: { format: ExportFormat; label: string; tooltip?: string }[];
}[] = [
  {
    label: "Image",
    formats: [
      { format: "png", label: "PNG" },
      { format: "jpg", label: "JPG" },
      { format: "webp", label: "WebP" },
    ],
  },
  {
    label: "Vector",
    formats: [{ format: "svg", label: "SVG" }],
  },
  {
    label: "Editable",
    formats: [
      {
        format: "psd",
        label: "PSD",
        tooltip:
          "Layered bitmap PSD. Use @poster/core components (Text, Image, …) for per-element layers.",
      },
      {
        format: "pptx",
        label: "PPTX",
        tooltip:
          "Native-objects PPTX. Use @poster/core components for editable text and images.",
      },
    ],
  },
  {
    label: "Document",
    formats: [{ format: "pdf", label: "PDF" }],
  },
  {
    label: "Data",
    formats: [
      { format: "csv", label: "CSV" },
      { format: "xlsx", label: "XLSX" },
    ],
  },
];

interface ExportMenuProps {
  bridge: SandboxBridge | null;
  children: ReactElement;
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
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {GROUPS.map((group, gi) => (
          <div key={group.label}>
            {gi > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            {group.formats.map(({ format, label, tooltip }) => {
              const item = (
                <DropdownMenuItem key={format} onClick={() => void handleExport(format)}>
                  {label}
                </DropdownMenuItem>
              );
              return tooltip ? (
                <WithTooltip key={format} label={tooltip} side="left">
                  {item}
                </WithTooltip>
              ) : (
                item
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
