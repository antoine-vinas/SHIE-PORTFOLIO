"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { Wordmark } from "@/components/branding/Wordmark";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const scrollScale = scrolled ? 0.85 : 1;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-hairline/20 bg-background/95 backdrop-blur-md py-2"
          : "border-transparent bg-background/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Wordmark variant="header" scrollScale={scrollScale} />

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          <Link
            href="/"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors min-h-[44px] flex items-center ${
              pathname === "/"
                ? "text-accent"
                : "text-body hover:text-accent"
            }`}
          >
            Home
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors min-h-[44px] flex items-center whitespace-nowrap ${
                pathname === cat.href
                  ? "text-accent"
                  : "text-body hover:text-accent"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="lg:hidden flex flex-col justify-center items-center w-11 h-11 rounded-lg border border-hairline/30 text-heading"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
