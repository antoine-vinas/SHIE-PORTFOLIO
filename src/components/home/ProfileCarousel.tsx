"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ProfileCarouselProps {
  photos: string[];
}

export function ProfileCarousel({ photos }: ProfileCarouselProps) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    if (photos.length <= 1) return;
    setIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    if (photos.length <= 1) return;
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [photos.length, next]);

  if (photos.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-card bg-surface border border-hairline/20 flex items-center justify-center">
        <span className="text-body/40 font-medium text-sm">Profile photo</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-hairline/20">
        <Image
          src={photos[index]}
          alt={`Profile photo ${index + 1}`}
          fill
          sizes="(max-width: 640px) 80vw, 384px"
          className="object-cover transition-opacity duration-500"
          priority
        />
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 border border-hairline/30 text-heading backdrop-blur-sm"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 border border-hairline/30 text-heading backdrop-blur-sm"
            aria-label="Next photo"
          >
            ›
          </button>
          <div className="mt-4 flex justify-center gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all min-w-[8px] min-h-[8px] ${
                  i === index
                    ? "w-6 bg-accent"
                    : "w-2 bg-hairline/40"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
