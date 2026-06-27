import { DotGridBackground } from "@/components/ui/DotGridBackground";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { ProfileCarousel } from "./ProfileCarousel";

interface BehindTheCanvasProps {
  bio: string;
  profilePhotos: string[];
}

export function BehindTheCanvas({ bio, profilePhotos }: BehindTheCanvasProps) {
  return (
    <DotGridBackground className="py-12 sm:py-20" perspective>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h2
            className="font-display text-heading text-center mb-10 sm:mb-14"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}
          >
            Behind the canvas
          </h2>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeInOnScroll delay={100}>
            <ProfileCarousel photos={profilePhotos} />
          </FadeInOnScroll>

          <FadeInOnScroll delay={200}>
            <div className="space-y-4">
              {bio.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="font-sans font-medium text-body leading-relaxed text-base sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </DotGridBackground>
  );
}
