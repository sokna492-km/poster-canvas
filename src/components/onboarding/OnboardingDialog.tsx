import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ONBOARDING_STEPS } from "@/data/onboardingSteps";
import { buildPosterAiPrompt } from "@/data/aiPrompt";
import { DEFAULT_SIZE } from "@/data/sizes";
import { markOnboardingComplete } from "@/lib/onboarding";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/stores/projectStore";
import { useUiStore } from "@/stores/uiStore";

export function OnboardingDialog() {
  const open = useUiStore((s) => s.onboardingOpen);
  const setOpen = useUiStore((s) => s.setOnboardingOpen);
  const width = useProjectStore((s) => s.current?.width ?? DEFAULT_SIZE.width);
  const height = useProjectStore((s) => s.current?.height ?? DEFAULT_SIZE.height);
  const [step, setStep] = useState(0);

  const total = ONBOARDING_STEPS.length;
  const current = ONBOARDING_STEPS[step]!;
  const isFirst = step === 0;
  const isLast = step === total - 1;

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  function completeAndClose() {
    markOnboardingComplete();
    setOpen(false);
  }

  function onOpenChange(next: boolean) {
    if (!next) completeAndClose();
    else setOpen(true);
  }

  async function copyAiPrompt() {
    try {
      await navigator.clipboard.writeText(buildPosterAiPrompt(width, height));
      toast.success("AI prompt copied");
    } catch {
      toast.error("Could not copy prompt");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="space-y-2 border-b border-border px-6 py-5 text-left">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Step {step + 1} of {total}
          </p>
          <DialogTitle className="text-xl">{current.title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {current.body}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          {current.bullets && current.bullets.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground/90">
              {current.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          {current.showCopyPrompt ? (
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              onClick={() => void copyAiPrompt()}
            >
              <Sparkles className="h-4 w-4" />
              Copy AI prompt
            </Button>
          ) : null}

          <div className="flex items-center justify-center gap-1.5 pt-1">
            {ONBOARDING_STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                onClick={() => setStep(i)}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex-row items-center justify-between gap-2 border-t border-border px-6 py-4 sm:justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={completeAndClose}>
            Skip
          </Button>
          <div className="flex items-center gap-2">
            {!isFirst ? (
              <Button type="button" variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : null}
            {isLast ? (
              <Button type="button" size="sm" onClick={completeAndClose}>
                Get started
              </Button>
            ) : (
              <Button type="button" size="sm" onClick={() => setStep((s) => s + 1)}>
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
