"use client";

import { useState } from "react";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";

interface ProjectFormProps {
  project?: Project | null;
  defaultCategory?: CategorySlug;
  onSave: () => void;
  onCancel: () => void;
}

export function ProjectForm({
  project,
  defaultCategory = "production-managing",
  onSave,
  onCancel,
}: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [category, setCategory] = useState<CategorySlug>(
    project?.category ?? defaultCategory
  );
  const [description, setDescription] = useState(project?.description ?? "");
  const [coverImage, setCoverImage] = useState(project?.cover_image_url ?? "");
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [videoUrl, setVideoUrl] = useState(project?.video_url ?? "");
  const [projectDate, setProjectDate] = useState(
    project?.project_date?.split("T")[0] ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverImage) {
      setError("Title and cover image are required.");
      return;
    }

    setSaving(true);
    setError(null);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const payload = {
      title: title.trim(),
      category,
      description: description.trim() || null,
      cover_image_url: coverImage,
      images: images.filter((img) => img !== coverImage),
      video_url: videoUrl.trim() || null,
      project_date: projectDate || null,
    };

    let result;
    if (project) {
      result = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project.id);
    } else {
      const { data: maxOrder } = await supabase
        .from("projects")
        .select("display_order")
        .eq("category", category)
        .order("display_order", { ascending: false })
        .limit(1)
        .single();

      result = await supabase.from("projects").insert({
        ...payload,
        display_order: (maxOrder?.display_order ?? -1) + 1,
      });
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="font-sans text-xl font-bold text-heading">
        {project ? "Edit Project" : "New Project"}
      </h3>

      {error && (
        <div className="rounded-card bg-red-900/30 border border-red-800/50 px-4 py-3 text-sm text-red-200 font-medium">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-sans text-sm font-bold text-heading mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-card border border-hairline/30 bg-background px-4 py-3 text-body font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-[44px]"
          />
        </div>

        <div>
          <label className="block font-sans text-sm font-bold text-heading mb-1.5">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategorySlug)}
            className="w-full rounded-card border border-hairline/30 bg-background px-4 py-3 text-body font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-[44px]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-sans text-sm font-bold text-heading mb-1.5">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-card border border-hairline/30 bg-background px-4 py-3 text-body font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
        />
      </div>

      <ImageUploader
        label="Cover Image *"
        value={coverImage}
        onChange={(v) => setCoverImage(v as string)}
      />

      <ImageUploader
        label="Additional Images"
        value={images}
        onChange={(v) => setImages(v as string[])}
        multiple
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-sans text-sm font-bold text-heading mb-1.5">
            Video URL (YouTube / Vimeo)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-card border border-hairline/30 bg-background px-4 py-3 text-body font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-[44px]"
          />
        </div>

        <div>
          <label className="block font-sans text-sm font-bold text-heading mb-1.5">
            Project Date
          </label>
          <input
            type="date"
            value={projectDate}
            onChange={(e) => setProjectDate(e.target.value)}
            className="w-full rounded-card border border-hairline/30 bg-background px-4 py-3 text-body font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-[44px]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : project ? "Update Project" : "Create Project"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
