"use client";

import Image from "next/image";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index: number;
}

export function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left rounded-card overflow-hidden bg-surface border border-hairline/20 transition-all duration-300 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`View project: ${project.title}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.cover_image_url}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={index < 3}
        />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-sans text-lg font-bold text-heading line-clamp-2">
          {project.title}
        </h3>
        {project.project_date && (
          <p className="mt-1 text-sm text-body/70">
            {new Date(project.project_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </p>
        )}
      </div>
    </button>
  );
}
