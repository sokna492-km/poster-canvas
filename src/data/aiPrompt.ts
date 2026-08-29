/** Template prompt for generating Poster Studio TSX with an external AI. */
export function buildPosterAiPrompt(width: number, height: number): string {
  return `Create a poster for me as React/TSX code I can paste into Poster Studio.

Requirements:
- One default-exported Poster component
- Fixed size: ${width} × ${height}
- Use HTML + Tailwind classes (or @poster/core if helpful)
- No React import, no other packages
- Look like a real poster, not a website — big text, clear layout, strong colors
- Fill the whole canvas
- Optional brand mark: import { Logo } from "@poster/core" and place <Logo maxHeight={48} /> where the logo should sit (the studio supplies the uploaded asset). Prefer leaving logo placement to the studio overlay unless the layout needs the logo in-flow.

Poster details:
- Type: [event / social post / announcement / quote / product / educational]
- Title: [MAIN TITLE]
- Subtitle: [optional]
- Extra text: [date, place, CTA, short body]
- Language: [English / Khmer / both]
- Style: [minimal / bold / corporate / playful / dark / clean]
- Colors: [describe or leave blank]
- Must include: [anything important]
- Must avoid: [anything you don't want]

Return only the code.`;
}
