import { useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { LogoCorner } from "@/core/types";
import { fileToLogoAsset } from "@/lib/logoAsset";
import { codeUsesInlineLogo } from "@/lib/logoSlot";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";

const CORNERS: { value: LogoCorner; label: string }[] = [
  { value: "top-left", label: "TL" },
  { value: "top-right", label: "TR" },
  { value: "bottom-left", label: "BL" },
  { value: "bottom-right", label: "BR" },
];

const HEIGHTS = ["40", "64", "96", "128"] as const;

const LOGO_UPLOAD_EVENT = "poster-studio:add-logo";

/** Opens the logo file picker (command palette / external). */
export function requestLogoUpload(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LOGO_UPLOAD_EVENT));
  }
}

export function LogoControls() {
  const code = useEditorStore((s) => s.code);
  const current = useProjectStore((s) => s.current);
  const setLogo = useProjectStore((s) => s.setLogo);
  const setLogoSlot = useProjectStore((s) => s.setLogoSlot);
  const clearLogo = useProjectStore((s) => s.clearLogo);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const logo = current?.assets?.logo;
  const slot = current?.logoSlot;
  const inlineLogo = codeUsesInlineLogo(code);
  const placementDisabled = !logo || inlineLogo;

  useEffect(() => {
    const onRequest = () => {
      setOpen(true);
      inputRef.current?.click();
    };
    window.addEventListener(LOGO_UPLOAD_EVENT, onRequest);
    return () => window.removeEventListener(LOGO_UPLOAD_EVENT, onRequest);
  }, []);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!current) {
      toast.error("Create or open a project first.");
      return;
    }
    setBusy(true);
    try {
      const asset = await fileToLogoAsset(file);
      setLogo(asset);
      toast.success("Logo added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add logo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          title="Logo"
          disabled={!current}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logo</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-3 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">Brand logo</p>
          {logo ? (
            <img
              src={logo.dataUrl}
              alt=""
              className="h-7 max-w-[5rem] object-contain"
            />
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />

        <div className="flex gap-1.5">
          <Button
            type="button"
            size="sm"
            className="h-8 flex-1 gap-1.5 text-xs"
            disabled={busy || !current}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            {logo ? "Replace" : "Upload"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            disabled={!logo || busy}
            onClick={() => {
              clearLogo();
              toast.success("Logo removed");
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </Button>
        </div>

        {inlineLogo ? (
          <p className="text-xs text-muted-foreground">
            Placement is controlled in your code via {"<Logo />"}. Upload still updates the
            asset.
          </p>
        ) : (
          <>
            <div className={cn(placementDisabled && "pointer-events-none opacity-50")}>
              <p className="mb-1.5 text-xs text-muted-foreground">Corner</p>
              <ToggleGroup
                type="single"
                size="sm"
                value={slot?.corner ?? "top-left"}
                onValueChange={(value) => {
                  if (value) setLogoSlot({ corner: value as LogoCorner });
                }}
                className="justify-start"
                disabled={placementDisabled}
              >
                {CORNERS.map((c) => (
                  <ToggleGroupItem
                    key={c.value}
                    value={c.value}
                    className="h-7 px-2 text-xs"
                    aria-label={c.value}
                  >
                    {c.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className={cn(placementDisabled && "pointer-events-none opacity-50")}>
              <p className="mb-1.5 text-xs text-muted-foreground">Max height</p>
              <Select
                value={String(slot?.maxHeight ?? 64)}
                onValueChange={(value) => setLogoSlot({ maxHeight: Number(value) })}
                disabled={placementDisabled}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HEIGHTS.map((h) => (
                    <SelectItem key={h} value={h} className="text-xs">
                      {h}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
