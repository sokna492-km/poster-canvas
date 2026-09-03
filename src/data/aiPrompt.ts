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
- Font sizes (use these px ranges; Tailwind arbitrary values like text-[60px] are fine):
  - Main headline: 60–68 px
  - Section/card headings: 34–42 px
  - Main body text: 26–30 px
  - Supporting text: 22–26 px
  - Labels / badges / CTA secondary text: 18–22 px
  - CTA / website: 28–34 px
- Optional brand mark: import { Logo } from "@poster/core" and place <Logo maxHeight={48} /> where the logo should sit (the studio supplies the uploaded asset). Prefer leaving logo placement to the studio overlay unless the layout needs the logo in-flow.
- For equations: use KaTeX via import { Math, BlockMath } from "@poster/core", or write $...$ / $$...$$ inside <Text> children. Do not fake formulas with Unicode glyphs when real math is needed. Chemistry: \\ce{H2O} via <Math tex={"\\\\ce{H2O}"} />. For a math-only poster, the user may paste bare TeX (e.g. x^2) with no React wrapper — the studio auto-wraps that; prefer a full Poster when layout matters.

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
