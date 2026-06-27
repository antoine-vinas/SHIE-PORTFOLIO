"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface WordmarkProps {
  variant?: "hero" | "header";
  scrollScale?: number;
  className?: string;
  asLink?: boolean;
}

export function Wordmark({
  variant = "hero",
  scrollScale = 1,
  className = "",
  asLink = true,
}: WordmarkProps) {
  const [canHover, setCanHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const isHero = variant === "hero";
  const effectiveScale = isHero ? 1 : scrollScale;

  const shiesSize = isHero
    ? "clamp(3rem, 10vw, 6.5rem)"
    : `clamp(1.25rem, 2.5vw, 1.75rem)`;

  const portfolioSize = isHero
    ? "clamp(0.875rem, 2.5vw, 1.25rem)"
    : `clamp(0.625rem, 1.5vw, 0.8125rem)`;

  const portfolioIndent = isHero ? "2.5rem" : "1.25rem";

  const content = (
    <div
      className={`inline-flex flex-col leading-none transition-transform duration-wordmark ease-out ${className}`}
      style={{
        transform: `scale(${effectiveScale})`,
        transformOrigin: isHero ? "center center" : "left center",
      }}
    >
      <span
        className={`font-display text-heading block transition-colors duration-wordmark ${
          mounted ? "wordmark-animate-shies" : "opacity-0"
        } ${canHover ? "group-hover:text-accent group-hover:scale-[1.03]" : ""}`}
        style={{
          fontSize: shiesSize,
          lineHeight: 1.1,
        }}
      >
        Shie&apos;s
      </span>
      <span
        className={`font-sans font-medium text-heading tracking-[0.18em] uppercase transition-colors duration-wordmark ${
          mounted ? "wordmark-animate-portfolio" : "opacity-0"
        } ${canHover ? "group-hover:text-accent" : ""}`}
        style={{
          fontSize: portfolioSize,
          marginLeft: portfolioIndent,
          marginTop: isHero ? "0.25rem" : "0.125rem",
        }}
      >
        Portfolio
      </span>
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className={`group inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm ${
          canHover ? "hover:scale-[1.02] transition-transform duration-wordmark" : ""
        }`}
        aria-label="Shie's Portfolio — Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
