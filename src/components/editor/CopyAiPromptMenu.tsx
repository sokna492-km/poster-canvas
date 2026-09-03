import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WithTooltip } from "@/components/ui/tooltip";
import {
  AI_PROMPT_TEMPLATES,
  type AiPromptTemplateId,
} from "@/data/aiPrompt";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/stores/projectStore";

interface CopyAiPromptMenuProps {
  /** Icon-only trigger (editor). Default true. */
  iconOnly?: boolean;
  /** Label when iconOnly is false. Default "Copy AI prompt". */
  label?: string;
  /** Menu open direction. Default top (editor FAB). */
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  triggerClassName?: string;
}

export function CopyAiPromptMenu({
  iconOnly = true,
  label = "Copy AI prompt",
  side = "top",
  className,
  triggerClassName,
}: CopyAiPromptMenuProps) {
  const setSize = useProjectStore((s) => s.setSize);

  async function copyTemplate(id: AiPromptTemplateId, label: string) {
    const template = AI_PROMPT_TEMPLATES.find((t) => t.id === id);
    if (!template) return;
    try {
      setSize(template.width, template.height);
      await navigator.clipboard.writeText(template.build(template.width, template.height));
      toast.success(`Copied ${label} prompt · ${template.width}×${template.height}`);
    } catch {
      toast.error("Could not copy prompt");
    }
  }

  return (
    <DropdownMenu>
      <WithTooltip label="Copy AI prompt" side="left">
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            size={iconOnly ? "icon" : "default"}
            className={cn(
              iconOnly
                ? "pointer-events-auto h-8 w-8 shadow-md transition-transform duration-200 ease-out hover:scale-110 hover:shadow-lg active:scale-95"
                : "gap-2",
              triggerClassName,
            )}
            aria-label="Copy AI prompt"
          >
            <Sparkles className={iconOnly ? "h-3.5 w-3.5" : "h-4 w-4"} />
            {iconOnly ? null : label}
          </Button>
        </DropdownMenuTrigger>
      </WithTooltip>
      <DropdownMenuContent
        side={side}
        align="end"
        className={cn("min-w-[14rem]", className)}
      >
        {AI_PROMPT_TEMPLATES.map((template) => (
          <DropdownMenuItem
            key={template.id}
            className="flex cursor-pointer flex-col items-start gap-0.5 py-2"
            onClick={() => void copyTemplate(template.id, template.label)}
          >
            <span className="text-sm font-medium">{template.label}</span>
            <span className="text-xs text-muted-foreground">{template.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
