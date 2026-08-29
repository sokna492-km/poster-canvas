import { describe, expect, it } from "vitest";
import { codeUsesInlineLogo, shouldUseLogoOverlay, DEFAULT_LOGO_SLOT } from "./logoSlot";

describe("logoSlot", () => {
  it("detects inline Logo JSX", () => {
    expect(codeUsesInlineLogo("<Logo className='x' />")).toBe(true);
    expect(codeUsesInlineLogo("<Logo>")).toBe(true);
    expect(codeUsesInlineLogo("const Logo = 1")).toBe(false);
  });

  it("enables overlay only when slot is set and code has no Logo", () => {
    expect(shouldUseLogoOverlay("export default function Poster(){}", DEFAULT_LOGO_SLOT)).toBe(
      true,
    );
    expect(shouldUseLogoOverlay("<Logo />", DEFAULT_LOGO_SLOT)).toBe(false);
    expect(shouldUseLogoOverlay("export default function Poster(){}", null)).toBe(false);
  });
});
