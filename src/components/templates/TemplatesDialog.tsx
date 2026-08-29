import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { TEMPLATES } from "@/data/templates";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";
import { useState } from "react";

export function TemplatesDialog() {
  const open = useUiStore((s) => s.templatesOpen);
  const setOpen = useUiStore((s) => s.setTemplatesOpen);
  const dirty = useEditorStore((s) => s.dirty);
  const loadTemplate = useProjectStore((s) => s.loadTemplate);
  const [pending, setPending] = useState<(typeof TEMPLATES)[number] | null>(null);

  const applyTemplate = (template: (typeof TEMPLATES)[number]) => {
    loadTemplate(template.code, template.width, template.height, template.name);
    setOpen(false);
    setPending(null);
  };

  const onSelect = (template: (typeof TEMPLATES)[number]) => {
    if (dirty) {
      setPending(template);
    } else {
      applyTemplate(template);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Templates</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className="rounded-md border border-border p-4 text-left transition-colors hover:bg-accent"
                onClick={() => onSelect(template)}
              >
                <div className="text-sm font-medium">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.category}</div>
                <p className="mt-2 text-xs text-muted-foreground">{template.description}</p>
                <div className="mt-2 text-xs tabular-nums text-muted-foreground">
                  {template.width} × {template.height}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pending)} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace current code?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Loading a template will replace the editor contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pending && applyTemplate(pending)}>
              Load template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
