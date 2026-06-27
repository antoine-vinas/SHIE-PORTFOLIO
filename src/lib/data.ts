import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import type { CategorySlug } from "@/lib/categories";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/lib/types";

export async function getProjectsByCategory(
  category: CategorySlug
): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("category", category)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (data ?? []) as Project[];
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (data ?? []) as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Project;
}

export async function getHomeContent(): Promise<HomeContent> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "home")
    .single();

  if (error || !data) {
    return DEFAULT_HOME_CONTENT;
  }

  const value = data.value as Partial<HomeContent>;
  return {
    bio: value.bio ?? DEFAULT_HOME_CONTENT.bio,
    profile_photos:
      value.profile_photos ?? DEFAULT_HOME_CONTENT.profile_photos,
  };
}
