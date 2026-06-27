"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtu.be")
    ) {
      const videoId = parsed.hostname.includes("youtu.be")
        ? parsed.pathname.slice(1)
        : parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return null;
  }
}

export function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, handleKeyDown]);

  if (!project) return null;

  const allImages = [
    project.cover_image_url,
    ...project.images.filter((img) => img !== project.cover_image_url),
  ];
  const embedUrl = project.video_url ? getEmbedUrl(project.video_url) : null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-card sm:rounded-card bg-surface border border-hairline/30 shadow-2xl">
        <div className="flex items-center justify-between border-b border-hairline/20 px-4 py-3 sm:px-6">
          <h2
            id="project-modal-title"
            className="font-sans text-lg sm:text-xl font-bold text-heading pr-4 line-clamp-2"
          >
            {project.title}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close project details"
            className="shrink-0 !min-w-0 !px-3"
          >
            <span className="text-2xl leading-none">&times;</span>
          </Button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {embedUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-card bg-black">
              <iframe
                src={embedUrl}
                title={`Video: ${project.title}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="grid gap-4">
            {allImages.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative w-full overflow-hidden rounded-card"
              >
                <Image
                  src={src}
                  alt={`${project.title} — image ${i + 1}`}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            ))}
          </div>

          {project.description && (
            <div className="border-t border-hairline/20 pt-4">
              <p className="font-sans font-medium text-body leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}

          {project.project_date && (
            <p className="text-sm text-body/60 font-medium">
              {new Date(project.project_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
