import { useEditorStore } from "@/stores/editorStore";
import { cn } from "@/lib/utils";

interface MobileCodeEditorProps {
  className?: string;
}

/**
 * Native textarea for small viewports. Monaco is unsupported on mobile and
 * its sub-16px input triggers iOS Safari auto-zoom; a 16px textarea fixes both.
 */
export function MobileCodeEditor({ className }: MobileCodeEditorProps) {
  const code = useEditorStore((s) => s.code);
  const setCode = useEditorStore((s) => s.setCode);

  return (
    <textarea
      aria-label="Editor content"
      value={code}
      onChange={(e) => setCode(e.target.value)}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      autoComplete="off"
      className={cn(
        "h-full min-h-0 w-full resize-none overflow-auto border-0 bg-background px-3 py-3",
        "font-mono text-[16px] leading-relaxed text-foreground outline-none",
        "placeholder:text-muted-foreground",
        className,
      )}
    />
  );
}
