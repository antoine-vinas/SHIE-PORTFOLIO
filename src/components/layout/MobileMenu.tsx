"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CATEGORIES } from "@/lib/categories";
import { Wordmark } from "@/components/branding/Wordmark";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-surface border-l border-hairline/20 p-6 shadow-2xl"
        aria-label="Mobile"
      >
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg border border-hairline/30 text-heading"
            aria-label="Close menu"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <div className="flex justify-center mb-10" onClick={onClose}>
          <Wordmark variant="hero" />
        </div>

        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/"
              onClick={onClose}
              className={`block rounded-card px-4 py-3 text-base font-medium min-h-[44px] ${
                pathname === "/"
                  ? "text-accent bg-hairline/10"
                  : "text-body hover:text-accent"
              }`}
            >
              Home
            </Link>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={cat.href}
                onClick={onClose}
                className={`block rounded-card px-4 py-3 text-base font-medium min-h-[44px] ${
                  pathname === cat.href
                    ? "text-accent bg-hairline/10"
                    : "text-body hover:text-accent"
                }`}
              >
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
