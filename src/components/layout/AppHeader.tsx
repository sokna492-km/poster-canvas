import { forwardRef, useEffect, useRef, useState } from "react";
import {
  CircleHelp,
  Download,
  FolderOpen,
  Home,
  ImageIcon,
  LayoutTemplate,
  Moon,
  MoreHorizontal,
  Play,
  Plus,
  Ruler,
  Save,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { WithTooltip } from "@/components/ui/tooltip";
import { ExportMenu } from "@/components/export/ExportMenu";
import { LogoControls, requestLogoPanel } from "@/components/logo/LogoControls";
import { krumathHomeUrl } from "@/lib/krumathUrls";
import { publicUrl } from "@/lib/publicUrl";
import { useViewportTier } from "@/hooks/use-viewport-tier";
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
  const tier = useViewportTier();
  const compact = tier !== "large";
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

  const runTip = previewStale ? "Run (preview out of date)" : "Run";

  return (
    <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-[var(--toolbar-bg)] px-3">
      <div className="inline-flex h-7 shrink-0 items-center gap-1.5 px-2 text-xs font-semibold tracking-wide text-muted-foreground">
        <img src={publicUrl("favicon.svg")} alt="" className="h-5 w-5" aria-hidden="true" />
        <span className="lg:hidden">KP Studio</span>
        <span className="hidden lg:inline">KruMath Poster Studio</span>
      </div>
      <div className="mx-1 hidden h-4 w-px bg-border sm:block" />
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className={cn(
          "h-7 border-none bg-transparent px-2 text-sm shadow-none focus-visible:ring-1",
          tier === "small" && "hidden",
          tier === "medium" && "max-w-[120px]",
          tier === "large" && "max-w-[200px]",
        )}
        aria-label="Project name"
      />
      {dirty && (
        <WithTooltip label="Unsaved changes">
          <span className="cursor-default text-xs text-muted-foreground">●</span>
        </WithTooltip>
      )}
      <div className="ml-auto flex min-w-0 items-center gap-1">
        {compact ? (
          <>
            <HeaderButton label="Save" onClick={() => void saveProject()}>
              <Save className="h-3.5 w-3.5" />
            </HeaderButton>
            <HeaderButton
              label="Run"
              tip={runTip}
              onClick={run}
              variant={previewStale ? "secondary" : "ghost"}
            >
              <Play className="h-3.5 w-3.5" />
            </HeaderButton>
            <ExportMenu bridge={bridge}>
              <HeaderButton label="Export" withTooltip={false}>
                <Download className="h-3.5 w-3.5" />
              </HeaderButton>
            </ExportMenu>
            <HeaderOverflowMenu
              theme={theme}
              onNew={() => void newProject()}
              onOpen={() => setProjectsOpen(true)}
              onTemplates={() => setTemplatesOpen(true)}
              onLogo={requestLogoPanel}
              onSize={() => setSizePickerOpen(true)}
              onHelp={() => setOnboardingOpen(true)}
              onTheme={toggleTheme}
            />
            <LogoControls visible={false} />
            <KruMathHomeButton />
          </>
        ) : (
          <>
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
              tip={runTip}
              onClick={run}
              variant={previewStale ? "secondary" : "ghost"}
            >
              <Play className="h-3.5 w-3.5" />
            </HeaderButton>
            <ExportMenu bridge={bridge}>
              <HeaderButton label="Export" withTooltip={false}>
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
            <div className="mx-0.5 h-4 w-px bg-border" />
            <KruMathHomeButton />
          </>
        )}
      </div>
    </header>
  );
}

function KruMathHomeButton() {
  return (
    <WithTooltip label="KruMath Home">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 px-2 text-xs"
        aria-label="Go to KruMath Home"
        asChild
      >
        <a href={krumathHomeUrl()}>
          <Home className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Home</span>
        </a>
      </Button>
    </WithTooltip>
  );
}

interface HeaderOverflowMenuProps {
  theme: "light" | "dark";
  onNew: () => void;
  onOpen: () => void;
  onTemplates: () => void;
  onLogo: () => void;
  onSize: () => void;
  onHelp: () => void;
  onTheme: () => void;
}

function HeaderOverflowMenu({
  theme,
  onNew,
  onOpen,
  onTemplates,
  onLogo,
  onSize,
  onHelp,
  onTheme,
}: HeaderOverflowMenuProps) {
  return (
    <DropdownMenu>
      <WithTooltip label="More">
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs"
            aria-label="More actions"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
      </WithTooltip>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuItem onSelect={onNew}>
          <Plus className="h-3.5 w-3.5" />
          New
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onOpen}>
          <FolderOpen className="h-3.5 w-3.5" />
          Open
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onTemplates}>
          <LayoutTemplate className="h-3.5 w-3.5" />
          Templates
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onLogo}>
          <ImageIcon className="h-3.5 w-3.5" />
          Logo
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onSize}>
          <Ruler className="h-3.5 w-3.5" />
          Size
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onHelp}>
          <CircleHelp className="h-3.5 w-3.5" />
          How to use
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onTheme}>
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          Theme
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const HeaderButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & {
    label: string;
    tip?: string;
    withTooltip?: boolean;
    children: React.ReactNode;
  }
>(({ label, tip, withTooltip = true, children, className, variant = "ghost", ...props }, ref) => {
  const button = (
    <Button
      ref={ref}
      type="button"
      variant={variant}
      size="sm"
      className={cn("h-7 gap-1.5 px-2 text-xs", className)}
      aria-label={label}
      {...props}
    >
      {children}
      <span className="hidden lg:inline">{label}</span>
    </Button>
  );

  if (!withTooltip) return button;
  return <WithTooltip label={tip ?? label}>{button}</WithTooltip>;
});
HeaderButton.displayName = "HeaderButton";
