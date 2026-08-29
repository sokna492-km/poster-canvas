export const ONBOARDING_STORAGE_KEY = "poster-studio.onboarding.v1";

export function hasCompletedOnboarding(): boolean {
  if (typeof localStorage === "undefined") return true;
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "done";
  } catch {
    return true;
  }
}

export function markOnboardingComplete(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "done");
  } catch {
    // Quota / private mode — ignore; tour may show again next visit.
  }
}
