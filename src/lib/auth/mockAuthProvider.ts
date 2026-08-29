import type { AuthProvider, AuthUser } from "@/core/types";

const KEY = "poster-studio.user.v1";

const LOCAL_USER: AuthUser = { id: "local", name: "Local User" };

/**
 * Placeholder auth. It only records a "signed in" flag locally so the UI can
 * exercise the boundary. krumath.com will supply the real implementation.
 */
export class MockAuthProvider implements AuthProvider {
  async getCurrentUser(): Promise<AuthUser | null> {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(KEY) ? LOCAL_USER : null;
  }

  async login(): Promise<AuthUser> {
    if (typeof localStorage !== "undefined") localStorage.setItem(KEY, "1");
    return LOCAL_USER;
  }

  async logout(): Promise<void> {
    if (typeof localStorage !== "undefined") localStorage.removeItem(KEY);
  }
}
