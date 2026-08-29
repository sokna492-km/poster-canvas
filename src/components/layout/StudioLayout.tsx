import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PosterPreview } from "@/components/preview/PosterPreview";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUiStore } from "@/stores/uiStore";

interface StudioLayoutProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export function StudioLayout({ iframeRef }: StudioLayoutProps) {
  const isMobile = useIsMobile();
  const mobileTab = useUiStore((s) => s.mobileTab);
  const setMobileTab = useUiStore((s) => s.setMobileTab);

  if (isMobile) {
    return (
      <Tabs
        value={mobileTab}
        onValueChange={(v) => setMobileTab(v as "code" | "preview")}
        className="flex h-full min-h-0 min-w-0 flex-1 flex-col"
      >
        <TabsList className="mx-3 mt-2 w-fit shrink-0">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="mt-0 min-h-0 min-w-0 flex-1 overflow-hidden data-[state=inactive]:hidden">
          <CodeEditor />
        </TabsContent>
        <TabsContent value="preview" className="mt-0 min-h-0 min-w-0 flex-1 overflow-hidden data-[state=inactive]:hidden">
          <PosterPreview iframeRef={iframeRef} />
        </TabsContent>
      </Tabs>
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
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <StudioLayout iframeRef={iframeRef} />
      </div>
    </TooltipProvider>
  );
}
