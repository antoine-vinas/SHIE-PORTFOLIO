import type { CategorySlug } from "./categories";

export interface Project {
  id: string;
  title: string;
  category: CategorySlug;
  description: string | null;
  cover_image_url: string;
  images: string[];
  video_url: string | null;
  project_date: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface HomeContent {
  bio: string;
  profile_photos: string[];
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
  bio: "I'm a visual storyteller and creative producer who brings ideas to life across production, publication, branding, and personal projects. From concept to final delivery, I craft narratives that resonate — blending strategy, aesthetics, and meticulous attention to detail.",
  profile_photos: [],
};
