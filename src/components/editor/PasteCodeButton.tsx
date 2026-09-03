import { ClipboardPaste } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WithTooltip } from "@/components/ui/tooltip";
import { useEditorStore } from "@/stores/editorStore";

export function PasteCodeButton() {
  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast.error("Clipboard is empty");
        return;
      }
      useEditorStore.getState().setCode(text);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Could not read clipboard — try long-press Paste in the editor");
    }
  }

  return (
    <WithTooltip label="Paste from clipboard">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Paste from clipboard"
        onClick={() => void pasteFromClipboard()}
      >
        <ClipboardPaste className="h-3.5 w-3.5" />
      </Button>
    </WithTooltip>
  );
}
