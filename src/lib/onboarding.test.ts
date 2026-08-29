import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  hasCompletedOnboarding,
  markOnboardingComplete,
  ONBOARDING_STORAGE_KEY,
} from "./onboarding";

describe("onboarding storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reports incomplete when key is missing", () => {
    expect(hasCompletedOnboarding()).toBe(false);
  });

  it("marks complete and reads it back", () => {
    markOnboardingComplete();
    expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe("done");
    expect(hasCompletedOnboarding()).toBe(true);
  });

  it("returns true when localStorage throws on read", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(hasCompletedOnboarding()).toBe(true);
    spy.mockRestore();
  });
});
