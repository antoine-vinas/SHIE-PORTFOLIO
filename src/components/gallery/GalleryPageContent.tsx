import { Suspense } from "react";
import { DotGridBackground } from "@/components/ui/DotGridBackground";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import type { CategorySlug } from "@/lib/categories";
import { getCategoryLabel } from "@/lib/categories";
import { getProjectsByCategory } from "@/lib/data";

interface GalleryPageProps {
  category: CategorySlug;
}

function GalleryFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[4/3] rounded-card bg-surface/50 animate-pulse"
        />
      ))}
    </div>
  );
}

export async function GalleryPageContent({ category }: GalleryPageProps) {
  const projects = await getProjectsByCategory(category);
  const label = getCategoryLabel(category);

  return (
    <DotGridBackground className="min-h-[60vh] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 sm:mb-14 text-center">
          <h1
            className="font-display text-heading mb-3"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)" }}
          >
            {label}
          </h1>
          <div className="mx-auto h-px w-16 bg-hairline/40" />
        </header>

        <Suspense fallback={<GalleryFallback />}>
          <GalleryGrid projects={projects} categoryLabel={label} />
        </Suspense>
      </div>
    </DotGridBackground>
  );
}
