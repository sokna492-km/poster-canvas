import { useEffect, useRef } from "react";
import { fitScale } from "@/data/sizes";
import { effectiveScale, usePreviewStore } from "@/stores/previewStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import { publicUrl } from "@/lib/publicUrl";

interface PreviewCanvasProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

const BACKGROUND_CLASS: Record<string, string> = {
  dark: "bg-neutral-900",
  light: "bg-neutral-100",
  checker:
    "bg-[length:16px_16px] bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] bg-white",
};

const PREVIEW_PADDING = 48;

export function PreviewCanvas({ iframeRef }: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const current = useProjectStore((s) => s.current);
  const width = current?.width ?? 1080;
  const height = current?.height ?? 1350;
  const fitMode = usePreviewStore((s) => s.fitMode);
  const zoom = usePreviewStore((s) => s.zoom);
  const fitScaleValue = usePreviewStore((s) => s.fitScale);
  const showGrid = usePreviewStore((s) => s.showGrid);
  const background = usePreviewStore((s) => s.background);
  const uiTheme = useUiStore((s) => s.theme);
  const reloadNonce = usePreviewStore((s) => s.reloadNonce);
  const setFitScale = usePreviewStore((s) => s.setFitScale);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width: vw, height: vh } = entry.contentRect;
      setFitScale(fitScale({ width, height }, { width: vw, height: vh }, PREVIEW_PADDING));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, setFitScale]);

  const scale = effectiveScale({ fitMode, fitScale: fitScaleValue, zoom });
  const scaledW = width * scale;
  const scaledH = height * scale;
  const followsAppTheme = background !== "checker" && background === uiTheme;

  return (
    <div
      ref={containerRef}
      className={cn(
        "studio-preview-panel relative h-full w-full overflow-auto",
        !followsAppTheme && BACKGROUND_CLASS[background],
      )}
    >
      {showGrid && (
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}
      {/* Avoid flex centering on the scrollport — it clips oversized posters. */}
      <div
        className="grid place-items-center p-6"
        style={{
          width: `max(100%, ${scaledW + PREVIEW_PADDING}px)`,
          height: `max(100%, ${scaledH + PREVIEW_PADDING}px)`,
        }}
      >
        <div
          className="relative overflow-hidden shadow-2xl"
          style={{
            width: scaledW,
            height: scaledH,
          }}
        >
          <iframe
            key={reloadNonce}
            ref={iframeRef}
            src={`${publicUrl("sandbox/index.html")}?v=katex-0.18.4`}
            title="Poster preview"
            sandbox="allow-scripts allow-same-origin"
            className="absolute left-0 top-0 origin-top-left border-0"
            style={{
              width,
              height,
              transform: `scale(${scale})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
