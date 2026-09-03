import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { WithTooltip } from "@/components/ui/tooltip";
import { useEditorStore } from "@/stores/editorStore";

export function ClearCodeButton() {
  const [open, setOpen] = useState(false);
  const code = useEditorStore((s) => s.code);
  const isEmpty = code.trim().length === 0;

  return (
    <>
      <WithTooltip label="Clear all code">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          aria-label="Clear all code"
          disabled={isEmpty}
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </WithTooltip>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all code?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the entire editor contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                useEditorStore.getState().setCode("");
                setOpen(false);
              }}
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
