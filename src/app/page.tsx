import { DotGridBackground } from "@/components/ui/DotGridBackground";
import { Wordmark } from "@/components/branding/Wordmark";
import { BehindTheCanvas } from "@/components/home/BehindTheCanvas";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { getHomeContent } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const { bio, profile_photos } = await getHomeContent();

  return (
    <>
      <DotGridBackground className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeInOnScroll>
            <Wordmark variant="hero" />
          </FadeInOnScroll>
          <FadeInOnScroll delay={300}>
            <p className="mt-8 mx-auto max-w-2xl font-sans font-medium text-body text-base sm:text-lg leading-relaxed">
              Visual storyteller &amp; creative producer crafting narratives
              across production, publication, and brand experiences.
            </p>
          </FadeInOnScroll>
        </div>
      </DotGridBackground>

      <BehindTheCanvas bio={bio} profilePhotos={profile_photos} />
    </>
  );
}
