export interface OnboardingStep {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
  /** When true, dialog shows a Copy AI prompt action. */
  showCopyPrompt?: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "decide",
    title: "Decide your poster",
    body: "Start with a clear idea: what is this poster for, who will see it, and what should they do or feel after looking at it?",
    bullets: [
      "Event, social post, announcement, product, or class promo",
      "Language (English, Khmer, or both)",
      "Mood: bold, clean, playful, corporate…",
    ],
  },
  {
    id: "copy-prompt",
    title: "Copy the AI prompt",
    body: "Poster Studio includes a ready-made prompt template sized for your canvas. Copy it, then fill in the bracketed fields to match your idea.",
    bullets: [
      "Use the button below, or the sparkle control in the code editor",
      "Edit titles, style notes, and must-include details before sending",
    ],
    showCopyPrompt: true,
  },
  {
    id: "generate",
    title: "Generate with your AI",
    body: "Paste the prompt into ChatGPT, Claude, Gemini, or any coding AI you like. Ask it to return only the poster TSX code.",
  },
  {
    id: "paste",
    title: "Paste into Poster Studio",
    body: "Select all code in the left editor and replace it with the AI response. Keep a single default-exported Poster component.",
  },
  {
    id: "run",
    title: "Run and revise",
    body: "Click Run in the preview toolbar (or press Cmd/Ctrl+Enter) to update the preview. Edits do not auto-run — revise the JSX, then Run again to see the result.",
  },
  {
    id: "polish",
    title: "Polish and export",
    body: "Finish with studio tools, then export when you are happy.",
    bullets: [
      "Size — change canvas dimensions",
      "Logo — upload your brand mark to a corner (or place <Logo /> in code)",
      "Templates — start from a ready layout",
      "Save — keep the project in this browser",
      "Export — PNG, SVG, PDF, JPG, or WebP",
    ],
  },
];
