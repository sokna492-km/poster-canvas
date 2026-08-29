/**
 * Core domain types for Poster Studio.
 * These types are intentionally storage-agnostic so they can map 1:1 to a
 * future database record (see docs/integration.md).
 */

export type LogoCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface PosterLogoAsset {
  dataUrl: string;
  fileName: string;
  mimeType: string;
}

export interface PosterLogoSlot {
  corner: LogoCorner;
  /** Default 64 */
  maxHeight: number;
  /** Default 40 */
  padding: number;
}

export interface PosterProjectAssets {
  logo?: PosterLogoAsset;
}

export interface PosterProject {
  id: string;
  name: string;
  code: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
  assets?: PosterProjectAssets;
  /** When set (and code has no inline `<Logo`), sandbox overlays the logo. */
  logoSlot?: PosterLogoSlot | null;
}

export interface PosterSizePreset {
  id: string;
  label: string;
  group: string;
  width: number;
  height: number;
}

export interface PosterTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  width: number;
  height: number;
  code: string;
}

export type RenderStatus = "idle" | "compiling" | "rendering" | "ready" | "error";

export type DiagnosticSeverity = "error" | "warning";

export interface Diagnostic {
  severity: DiagnosticSeverity;
  message: string;
  line?: number;
  column?: number;
  kind: "compile" | "runtime" | "preprocess";
}

export type ExportFormat = "png" | "svg" | "jpg" | "webp" | "pdf";

export interface ExportRequest {
  format: ExportFormat;
  scale?: number;
  fileName?: string;
}

export interface ExportResult {
  format: ExportFormat;
  /** Data URL (raster/pdf) or serialized markup (svg). */
  data: string;
  mimeType: string;
  fileName: string;
}

/** Export abstraction — a backend renderer can implement this later. */
export interface PosterExporter {
  export(request: ExportRequest): Promise<ExportResult>;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
}

/** Replaceable authentication boundary (krumath.com will implement this). */
export interface AuthProvider {
  getCurrentUser(): Promise<AuthUser | null>;
  login(): Promise<AuthUser>;
  logout(): Promise<void>;
}

/** Replaceable persistence boundary. */
export interface ProjectRepository {
  getProjects(): Promise<PosterProject[]>;
  getProject(id: string): Promise<PosterProject | null>;
  createProject(project: PosterProject): Promise<PosterProject>;
  updateProject(project: PosterProject): Promise<PosterProject>;
  deleteProject(id: string): Promise<void>;
}

/** Future GitHub / remote code source boundary. */
export interface CodeRepository {
  loadProject(id: string): Promise<PosterProject | null>;
  saveProject(project: PosterProject): Promise<PosterProject>;
}

export interface AppConfig {
  apiBaseUrl?: string;
  authProvider?: AuthProvider;
  projectRepository?: ProjectRepository;
}
