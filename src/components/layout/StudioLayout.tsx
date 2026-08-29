import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PosterPreview } from "@/components/preview/PosterPreview";
import { useViewportTier } from "@/hooks/use-viewport-tier";
import { useUiStore } from "@/stores/uiStore";

interface StudioLayoutProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export function StudioLayout({ iframeRef }: StudioLayoutProps) {
  const tier = useViewportTier();
  const workspaceTab = useUiStore((s) => s.workspaceTab);
  const setWorkspaceTab = useUiStore((s) => s.setWorkspaceTab);

  if (tier === "small") {
    return (
      <Tabs
        value={workspaceTab}
        onValueChange={(v) => setWorkspaceTab(v as "code" | "preview")}
        className="flex h-full min-h-0 min-w-0 flex-1 flex-col"
      >
        <TabsList className="mx-3 mt-2 w-fit shrink-0">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent
          value="code"
          className="mt-0 min-h-0 min-w-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
        >
          <CodeEditor />
        </TabsContent>
        <TabsContent
          value="preview"
          className="mt-0 min-h-0 min-w-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
        >
          <PosterPreview iframeRef={iframeRef} />
        </TabsContent>
      </Tabs>
    );
  }

  if (tier === "medium") {
    return (
      <ResizablePanelGroup orientation="vertical" className="h-full min-h-0 min-w-0 flex-1">
        <ResizablePanel defaultSize={40} minSize={20} className="min-h-0 min-w-0">
          <CodeEditor />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={20} className="min-h-0 min-w-0">
          <PosterPreview iframeRef={iframeRef} />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  return (
    <ResizablePanelGroup orientation="horizontal" className="h-full min-h-0 min-w-0 flex-1">
      <ResizablePanel defaultSize={45} minSize={25} className="min-w-0">
        <CodeEditor />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={55} minSize={25} className="min-w-0">
        <PosterPreview iframeRef={iframeRef} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function StudioLayoutShell({ iframeRef }: StudioLayoutProps) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <StudioLayout iframeRef={iframeRef} />
    </div>
  );
}
