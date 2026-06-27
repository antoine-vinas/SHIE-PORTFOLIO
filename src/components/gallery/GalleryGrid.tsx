"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { EmptyState } from "./EmptyState";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";

interface GalleryGridProps {
  projects: Project[];
  categoryLabel: string;
}

export function GalleryGrid({ projects, categoryLabel }: GalleryGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      setSelectedProject(found ?? null);
    } else {
      setSelectedProject(null);
    }
  }, [projectId, projects]);

  const openProject = useCallback(
    (project: Project) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("project", project.id);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const closeProject = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("project");
    const query = params.toString();
    router.push(query ? `?${query}` : window.location.pathname, {
      scroll: false,
    });
  }, [router, searchParams]);

  if (projects.length === 0) {
    return <EmptyState categoryLabel={categoryLabel} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {projects.map((project, index) => (
          <FadeInOnScroll key={project.id} delay={index * 80}>
            <ProjectCard
              project={project}
              onClick={() => openProject(project)}
              index={index}
            />
          </FadeInOnScroll>
        ))}
      </div>

      <ProjectDetailModal project={selectedProject} onClose={closeProject} />
    </>
  );
}
