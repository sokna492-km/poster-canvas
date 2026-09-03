import { PreviewCanvas } from "./PreviewCanvas";
import { PreviewToolbar } from "./PreviewToolbar";

interface PosterPreviewProps {
  iframeRef: (node: HTMLIFrameElement | null) => void;
}

export function PosterPreview({ iframeRef }: PosterPreviewProps) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      <PreviewToolbar />
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <PreviewCanvas iframeRef={iframeRef} />
      </div>
    </div>
  );
}
