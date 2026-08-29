import { Grid3x3, Minus, Plus, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WithTooltip } from "@/components/ui/tooltip";
import { usePreviewStore } from "@/stores/previewStore";

export function PreviewToolbar() {
  const zoomBy = usePreviewStore((s) => s.zoomBy);
  const fitMode = usePreviewStore((s) => s.fitMode);
  const setFitMode = usePreviewStore((s) => s.setFitMode);
  const setZoom = usePreviewStore((s) => s.setZoom);
  const toggleGrid = usePreviewStore((s) => s.toggleGrid);
  const cycleBackground = usePreviewStore((s) => s.cycleBackground);
  const reloadSandbox = usePreviewStore((s) => s.reloadSandbox);
  const showGrid = usePreviewStore((s) => s.showGrid);
  const zoom = usePreviewStore((s) => s.zoom);

  const zoomLabel = fitMode ? "Fit" : `${Math.round(zoom * 100)}%`;

  return (
    <div className="flex h-9 min-w-0 shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-[var(--toolbar-bg)] px-2">
      <ToolbarButton label="Zoom out" onClick={() => zoomBy(0.9)}>
        <Minus className="h-3.5 w-3.5" />
      </ToolbarButton>
      <span className="min-w-[3.5rem] text-center text-xs tabular-nums text-muted-foreground">
        {zoomLabel}
      </span>
      <ToolbarButton label="Zoom in" onClick={() => zoomBy(1.1)}>
        <Plus className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Fit to screen" onClick={() => setFitMode(true)} active={fitMode}>
        Fit
      </ToolbarButton>
      <ToolbarButton label="100%" onClick={() => setZoom(1)}>
        100%
      </ToolbarButton>
      <ToolbarButton label="Toggle grid" onClick={toggleGrid} active={showGrid}>
        <Grid3x3 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Cycle background" onClick={cycleBackground}>
        <RotateCcw className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Reload preview" onClick={reloadSandbox}>
        <RefreshCw className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <WithTooltip label={label}>
      <Button
        type="button"
        variant={active ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={onClick}
      >
        {children}
      </Button>
    </WithTooltip>
  );
}
