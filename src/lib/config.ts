import type { AppConfig, AuthProvider, ProjectRepository } from "@/core/types";
import { LocalProjectRepository } from "@/lib/storage/localProjectRepository";
import { MockAuthProvider } from "@/lib/auth/mockAuthProvider";

/**
 * Single place where the app's replaceable services are resolved.
 * Embedders (e.g. krumath.com) call `configureApp({ ... })` once before
 * mounting <PosterStudio /> to inject their own implementations.
 */
let config: Required<Pick<AppConfig, "authProvider" | "projectRepository">> & AppConfig = {
  authProvider: new MockAuthProvider(),
  projectRepository: new LocalProjectRepository(),
};

export function configureApp(next: AppConfig): void {
  config = { ...config, ...next };
}

export function getProjectRepository(): ProjectRepository {
  return config.projectRepository;
}

export function getAuthProvider(): AuthProvider {
  return config.authProvider;
}

export function getApiBaseUrl(): string | undefined {
  return config.apiBaseUrl;
}
