export const CATEGORIES = [
  {
    slug: "production-managing",
    label: "Production Managing",
    href: "/production-managing",
  },
  {
    slug: "publication-materials",
    label: "Publication Materials",
    href: "/publication-materials",
  },
  {
    slug: "branding-work",
    label: "Branding Work",
    href: "/branding-work",
  },
  {
    slug: "personal-work",
    label: "Personal Work",
    href: "/personal-work",
  },
  {
    slug: "photography",
    label: "Photography",
    href: "/photography",
  },
  {
    slug: "videography",
    label: "Videography",
    href: "/videography",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryLabel(slug: string): string {
  return getCategoryBySlug(slug)?.label ?? slug;
}
