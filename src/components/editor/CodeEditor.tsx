import { lazy, Suspense, useEffect, useRef } from "react";
import type { editor as MonacoEditor } from "monaco-editor";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Diagnostic } from "@/core/types";
import { buildPosterAiPrompt } from "@/data/aiPrompt";
import { DEFAULT_SIZE } from "@/data/sizes";
import { monacoThemeFor } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import { usePreviewStore } from "@/stores/previewStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";

const Monaco = lazy(() =>
  import("@monaco-editor/react").then((mod) => ({
    default: mod.default,
  })),
);

interface CodeEditorProps {
  className?: string;
}

function diagnosticsToMarkers(diagnostics: Diagnostic[]): MonacoEditor.IMarkerData[] {
  return diagnostics
    .filter((d) => d.line != null)
    .map((d) => ({
      severity: d.severity === "error" ? 8 : 4,
      message: d.message,
      startLineNumber: d.line ?? 1,
      startColumn: d.column ?? 1,
      endLineNumber: d.line ?? 1,
      endColumn: (d.column ?? 1) + 1,
    }));
}

export function CodeEditor({ className }: CodeEditorProps) {
  const code = useEditorStore((s) => s.code);
  const setCode = useEditorStore((s) => s.setCode);
  const diagnostics = usePreviewStore((s) => s.diagnostics);
  const theme = useUiStore((s) => s.theme);
  const width = useProjectStore((s) => s.current?.width ?? DEFAULT_SIZE.width);
  const height = useProjectStore((s) => s.current?.height ?? DEFAULT_SIZE.height);
  const monacoTheme = monacoThemeFor(theme);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const monaco = (window as Window & { monaco?: typeof import("monaco-editor") }).monaco;
    if (!monaco) return;
    monaco.editor.setTheme(monacoTheme);
  }, [monacoTheme]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;
    const monaco = (window as Window & { monaco?: typeof import("monaco-editor") }).monaco;
    if (!monaco) return;
    monaco.editor.setModelMarkers(model, "poster", diagnosticsToMarkers(diagnostics));
  }, [diagnostics]);

  async function copyAiPrompt() {
    try {
      await navigator.clipboard.writeText(buildPosterAiPrompt(width, height));
      toast.success("AI prompt copied");
    } catch {
      toast.error("Could not copy prompt");
    }
  }

  return (
    <div className={cn("relative", className ?? "studio-editor-panel h-full w-full")}>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading editor…
          </div>
        }
      >
        <Monaco
          height="100%"
          defaultLanguage="typescript"
          theme={monacoTheme}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            (window as Window & { monaco?: typeof monaco }).monaco = monaco;
            editor.updateOptions({
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
            });
          }}
          options={{
            padding: { top: 12 },
          }}
        />
      </Suspense>

      <div className="pointer-events-none absolute bottom-3 right-8 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="pointer-events-auto h-8 w-8 shadow-md"
              aria-label="Copy AI prompt"
              onClick={() => void copyAiPrompt()}
            >
              <Sparkles className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Copy AI prompt</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
