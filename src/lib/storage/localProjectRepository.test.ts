import { describe, expect, it } from "vitest";
import { MemoryProjectRepository, normalizeProject } from "./localProjectRepository";
import type { PosterProject } from "@/core/types";

function sample(id: string): PosterProject {
  const ts = "2026-01-01T00:00:00.000Z";
  return {
    id,
    name: `Project ${id}`,
    code: "export default function Poster() { return null; }",
    width: 1080,
    height: 1350,
    createdAt: ts,
    updatedAt: ts,
  };
}

describe("normalizeProject", () => {
  it("fills assets and logoSlot defaults for legacy records", () => {
    const normalized = normalizeProject(sample("legacy"));
    expect(normalized.assets).toEqual({});
    expect(normalized.logoSlot).toBeNull();
  });
});

describe("MemoryProjectRepository", () => {
  it("creates and lists projects", async () => {
    const repo = new MemoryProjectRepository();
    await repo.createProject(sample("a"));
    const projects = await repo.getProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.id).toBe("a");
  });

  it("updates and deletes projects", async () => {
    const repo = new MemoryProjectRepository();
    const project = sample("b");
    await repo.createProject(project);
    await repo.updateProject({ ...project, name: "Renamed" });
    expect((await repo.getProject("b"))?.name).toBe("Renamed");
    await repo.deleteProject("b");
    expect(await repo.getProject("b")).toBeNull();
  });
});
