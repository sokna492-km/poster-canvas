import { forwardRef, useEffect, useRef, useState } from "react";
import {
  CircleHelp,
  Download,
  FolderOpen,
  Home,
  LayoutTemplate,
  Moon,
  Play,
  Plus,
  Ruler,
  Save,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExportMenu } from "@/components/export/ExportMenu";
import { LogoControls } from "@/components/logo/LogoControls";
import { krumathHomeUrl } from "@/lib/krumathUrls";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { usePreviewStore } from "@/stores/previewStore";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import type { SandboxBridge } from "@/core/renderer";

interface AppHeaderProps {
  bridge: SandboxBridge | null;
}

export function AppHeader({ bridge }: AppHeaderProps) {
  const dirty = useEditorStore((s) => s.dirty);
  const run = useEditorStore((s) => s.run);
  const current = useProjectStore((s) => s.current);
  const renameProject = useProjectStore((s) => s.renameProject);
  const saveProject = useProjectStore((s) => s.saveProject);
  const newProject = useProjectStore((s) => s.newProject);
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const setProjectsOpen = useUiStore((s) => s.setProjectsOpen);
  const setTemplatesOpen = useUiStore((s) => s.setTemplatesOpen);
  const setSizePickerOpen = useUiStore((s) => s.setSizePickerOpen);
  const setOnboardingOpen = useUiStore((s) => s.setOnboardingOpen);
  const previewStale = usePreviewStore((s) => s.previewStale);
  const [name, setName] = useState(current?.name ?? "Untitled Poster");
  const renameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setName(current?.name ?? "Untitled Poster");
  }, [current?.name]);

  const onNameChange = (value: string) => {
    setName(value);
    if (renameTimer.current) clearTimeout(renameTimer.current);
    renameTimer.current = setTimeout(() => {
      if (value.trim()) void renameProject(value.trim());
    }, 500);
  };

  return (
    <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-[var(--toolbar-bg)] px-3">
      <a
        href={krumathHomeUrl()}
        className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        title="KruMath Home"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Poster Studio</span>
      </a>
      <div className="mx-1 h-4 w-px bg-border" />
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="h-7 max-w-[200px] border-none bg-transparent px-2 text-sm shadow-none focus-visible:ring-1"
        aria-label="Project name"
      />
      {dirty && (
        <span className="text-xs text-muted-foreground" title="Unsaved changes">
          ●
        </span>
      )}
      <div className="ml-auto flex items-center gap-1">
        <HeaderButton label="New" onClick={() => void newProject()}>
          <Plus className="h-3.5 w-3.5" />
        </HeaderButton>
        <HeaderButton label="Open" onClick={() => setProjectsOpen(true)}>
          <FolderOpen className="h-3.5 w-3.5" />
        </HeaderButton>
        <HeaderButton label="Save" onClick={() => void saveProject()}>
          <Save className="h-3.5 w-3.5" />
        </HeaderButton>
        <HeaderButton
          label="Run"
          onClick={run}
          variant={previewStale ? "secondary" : "ghost"}
          title={previewStale ? "Run (preview out of date)" : "Run"}
        >
          <Play className="h-3.5 w-3.5" />
        </HeaderButton>
        <ExportMenu bridge={bridge}>
          <HeaderButton label="Export">
            <Download className="h-3.5 w-3.5" />
          </HeaderButton>
        </ExportMenu>
        <HeaderButton label="Templates" onClick={() => setTemplatesOpen(true)}>
          <LayoutTemplate className="h-3.5 w-3.5" />
        </HeaderButton>
        <LogoControls />
        <HeaderButton label="Size" onClick={() => setSizePickerOpen(true)}>
          <Ruler className="h-3.5 w-3.5" />
        </HeaderButton>
        <HeaderButton label="How to use" onClick={() => setOnboardingOpen(true)}>
          <CircleHelp className="h-3.5 w-3.5" />
        </HeaderButton>
        <HeaderButton label="Theme" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </HeaderButton>
      </div>
    </header>
  );
}

const HeaderButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & {
    label: string;
    children: React.ReactNode;
  }
>(({ label, children, className, variant = "ghost", ...props }, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      variant={variant}
      size="sm"
      className={cn("h-7 gap-1.5 px-2 text-xs", className)}
      title={label}
      {...props}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
});
HeaderButton.displayName = "HeaderButton";
