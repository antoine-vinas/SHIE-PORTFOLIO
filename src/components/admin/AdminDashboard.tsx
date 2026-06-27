"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import type { Project } from "@/lib/types";
import type { HomeContent } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { ProjectForm } from "./ProjectForm";
import { SortableProjectList } from "./SortableProjectList";
import { HomeContentEditor } from "./HomeContentEditor";
import { createClient } from "@/lib/supabase/client";

interface AdminDashboardProps {
  initialProjects: Project[];
  homeContent: HomeContent;
}

export function AdminDashboard({
  initialProjects,
  homeContent,
}: AdminDashboardProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [selectedCategory, setSelectedCategory] =
    useState<CategorySlug>("production-managing");
  const [view, setView] = useState<"list" | "form" | "home">("list");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [bio, setBio] = useState(homeContent.bio);
  const [photos, setPhotos] = useState(homeContent.profile_photos);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setProjects(data as Project[]);

    const { data: home } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "home")
      .single();
    if (home?.value) {
      const v = home.value as HomeContent;
      setBio(v.bio);
      setPhotos(v.profile_photos);
    }

    router.refresh();
  }, [router]);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const categoryProjects = projects
    .filter((p) => p.category === selectedCategory)
    .sort((a, b) => a.display_order - b.display_order);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;

    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", id);
    await refresh();
  };

  const handleReorder = (orderedIds: string[]) => {
    setProjects((prev) => {
      const updated = [...prev];
      orderedIds.forEach((id, index) => {
        const proj = updated.find((p) => p.id === id);
        if (proj) proj.display_order = index;
      });
      return updated;
    });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background dot-grid-bg">
      <header className="border-b border-hairline/20 bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1
              className="font-display text-heading"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
            >
              Admin
            </h1>
            <p className="text-sm font-medium text-body/60">
              Manage portfolio content
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => router.push("/")}>
              View Site
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={view === "list" ? "primary" : "secondary"}
            onClick={() => {
              setView("list");
              setEditingProject(null);
            }}
          >
            Projects
          </Button>
          <Button
            variant={view === "home" ? "primary" : "secondary"}
            onClick={() => setView("home")}
          >
            Home Page
          </Button>
          {view === "list" && (
            <Button
              variant="secondary"
              className="ml-auto"
              onClick={() => {
                setEditingProject(null);
                setView("form");
              }}
            >
              + New Project
            </Button>
          )}
        </div>

        {view === "home" && (
          <div className="rounded-card border border-hairline/20 bg-surface p-6">
            <HomeContentEditor
              initialBio={bio}
              initialPhotos={photos}
              onSave={refresh}
            />
          </div>
        )}

        {view === "form" && (
          <div className="rounded-card border border-hairline/20 bg-surface p-6">
            <ProjectForm
              project={editingProject}
              defaultCategory={selectedCategory}
              onSave={() => {
                setView("list");
                setEditingProject(null);
                refresh();
              }}
              onCancel={() => {
                setView("list");
                setEditingProject(null);
              }}
            />
          </div>
        )}

        {view === "list" && (
          <div className="rounded-card border border-hairline/20 bg-surface p-6">
            <div className="mb-6">
              <label className="block font-sans text-sm font-bold text-heading mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as CategorySlug)
                }
                className="w-full sm:w-auto rounded-card border border-hairline/30 bg-background px-4 py-3 text-body font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-[44px]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-body/50 font-medium">
                Drag projects to reorder within this category.
              </p>
            </div>

            <SortableProjectList
              projects={categoryProjects}
              category={selectedCategory}
              onEdit={(p) => {
                setEditingProject(p);
                setView("form");
              }}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />
          </div>
        )}
      </div>
    </div>
  );
}
