import { create } from "zustand";
import type { PosterLogoAsset, PosterLogoSlot, PosterProject } from "@/core/types";
import { DEFAULT_SIZE } from "@/data/sizes";
import { STARTER_CODE } from "@/data/templates";
import { getProjectRepository } from "@/lib/config";
import { DEFAULT_LOGO_SLOT } from "@/lib/logoSlot";
import { useEditorStore } from "@/stores/editorStore";
import { usePreviewStore } from "@/stores/previewStore";
import { toast } from "sonner";

interface ProjectState {
  current: PosterProject | null;
  projects: PosterProject[];
  loading: boolean;
  error: string | null;
  loadProjects: () => Promise<void>;
  openProject: (id: string) => Promise<void>;
  newProject: (name?: string, width?: number, height?: number) => Promise<void>;
  saveProject: () => Promise<void>;
  duplicateProject: () => Promise<void>;
  renameProject: (name: string, id?: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setSize: (width: number, height: number) => void;
  loadTemplate: (code: string, width: number, height: number, name?: string) => void;
  setLogo: (asset: PosterLogoAsset) => void;
  setLogoSlot: (partial: Partial<PosterLogoSlot>) => void;
  clearLogo: () => void;
}

function now(): string {
  return new Date().toISOString();
}

function markProjectDirty(): void {
  const { code, setCode } = useEditorStore.getState();
  setCode(code);
}

function createBlankProject(
  name = "Untitled Poster",
  width = DEFAULT_SIZE.width,
  height = DEFAULT_SIZE.height,
): PosterProject {
  const ts = now();
  return {
    id: crypto.randomUUID(),
    name,
    code: STARTER_CODE,
    width,
    height,
    createdAt: ts,
    updatedAt: ts,
    assets: {},
    logoSlot: null,
  };
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  current: null,
  projects: [],
  loading: false,
  error: null,

  loadProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await getProjectRepository().getProjects();
      set({ projects, loading: false });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  openProject: async (id) => {
    set({ loading: true, error: null });
    try {
      const project = await getProjectRepository().getProject(id);
      if (!project) {
        set({ loading: false, error: "Project not found" });
        return;
      }
      useEditorStore.getState().resetCode(project.code);
      usePreviewStore.getState().reloadSandbox();
      set({ current: project, loading: false });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  newProject: async (name, width, height) => {
    const project = createBlankProject(
      name,
      width ?? DEFAULT_SIZE.width,
      height ?? DEFAULT_SIZE.height,
    );
    set({ loading: true, error: null });
    try {
      await getProjectRepository().createProject(project);
      useEditorStore.getState().resetCode(project.code);
      usePreviewStore.getState().reloadSandbox();
      const projects = await getProjectRepository().getProjects();
      set({ current: project, projects, loading: false });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  saveProject: async () => {
    const { current } = get();
    if (!current) {
      toast.error("Nothing to save — create or open a project first");
      return;
    }
    set({ loading: true, error: null });
    try {
      const code = useEditorStore.getState().code;
      const updated: PosterProject = {
        ...current,
        code,
        updatedAt: now(),
      };
      await getProjectRepository().updateProject(updated);
      useEditorStore.getState().markSaved();
      const projects = await getProjectRepository().getProjects();
      set({ current: updated, projects, loading: false });
      toast.success(`Saved “${updated.name}”`);
    } catch (err) {
      const message = String(err);
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  duplicateProject: async () => {
    const { current } = get();
    if (!current) return;
    const code = useEditorStore.getState().code;
    const ts = now();
    const copy: PosterProject = {
      ...current,
      id: crypto.randomUUID(),
      name: `${current.name} (copy)`,
      code,
      assets: current.assets ? { ...current.assets } : {},
      logoSlot: current.logoSlot ? { ...current.logoSlot } : null,
      createdAt: ts,
      updatedAt: ts,
    };
    set({ loading: true, error: null });
    try {
      await getProjectRepository().createProject(copy);
      useEditorStore.getState().resetCode(copy.code);
      usePreviewStore.getState().reloadSandbox();
      const projects = await getProjectRepository().getProjects();
      set({ current: copy, projects, loading: false });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  renameProject: async (name: string, id?: string) => {
    const { current, projects } = get();
    const target = id ? (projects.find((p) => p.id === id) ?? current) : current;
    if (!target) return;
    const updated: PosterProject = { ...target, name, updatedAt: now() };
    set({ loading: true, error: null });
    try {
      await getProjectRepository().updateProject(updated);
      const nextProjects = await getProjectRepository().getProjects();
      set({
        current: get().current?.id === updated.id ? updated : get().current,
        projects: nextProjects,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await getProjectRepository().deleteProject(id);
      const projects = await getProjectRepository().getProjects();
      const { current } = get();
      if (current?.id === id) {
        useEditorStore.getState().resetCode(STARTER_CODE);
        usePreviewStore.getState().reloadSandbox();
        set({ current: null, projects, loading: false });
      } else {
        set({ projects, loading: false });
      }
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  setSize: (width, height) => {
    const { current } = get();
    if (!current) return;
    const updated: PosterProject = { ...current, width, height, updatedAt: now() };
    set({ current: updated });
    usePreviewStore.getState().reloadSandbox();
  },

  loadTemplate: (code, width, height, name) => {
    const { current } = get();
    if (current) {
      // Keep assets / logoSlot so branding survives template swaps.
      const updated: PosterProject = {
        ...current,
        code,
        width,
        height,
        name: name ?? current.name,
        updatedAt: now(),
      };
      set({ current: updated });
    } else {
      const ts = now();
      set({
        current: {
          id: crypto.randomUUID(),
          name: name ?? "Untitled Poster",
          code,
          width,
          height,
          createdAt: ts,
          updatedAt: ts,
          assets: {},
          logoSlot: null,
        },
      });
    }
    useEditorStore.getState().resetCode(code);
    usePreviewStore.getState().reloadSandbox();
  },

  setLogo: (asset) => {
    const { current } = get();
    if (!current) return;
    const updated: PosterProject = {
      ...current,
      assets: { ...current.assets, logo: asset },
      logoSlot: current.logoSlot ?? { ...DEFAULT_LOGO_SLOT },
      updatedAt: now(),
    };
    set({ current: updated });
    markProjectDirty();
  },

  setLogoSlot: (partial) => {
    const { current } = get();
    if (!current) return;
    const base = current.logoSlot ?? { ...DEFAULT_LOGO_SLOT };
    const updated: PosterProject = {
      ...current,
      logoSlot: { ...base, ...partial },
      updatedAt: now(),
    };
    set({ current: updated });
    markProjectDirty();
  },

  clearLogo: () => {
    const { current } = get();
    if (!current) return;
    const assets = { ...current.assets };
    delete assets.logo;
    const updated: PosterProject = {
      ...current,
      assets,
      logoSlot: null,
      updatedAt: now(),
    };
    set({ current: updated });
    markProjectDirty();
  },
}));
