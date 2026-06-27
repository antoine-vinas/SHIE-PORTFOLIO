"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";

interface HomeContentEditorProps {
  initialBio: string;
  initialPhotos: string[];
  onSave: () => void;
}

export function HomeContentEditor({
  initialBio,
  initialPhotos,
  onSave,
}: HomeContentEditorProps) {
  const [bio, setBio] = useState(initialBio);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.from("site_content").upsert(
      {
        key: "home",
        value: { bio, profile_photos: photos },
      },
      { onConflict: "key" }
    );

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Home page content saved.");
      onSave();
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-sans text-xl font-bold text-heading">
        Home Page Content
      </h3>

      <div>
        <label className="block font-sans text-sm font-bold text-heading mb-1.5">
          Bio (Behind the canvas)
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          className="w-full rounded-card border border-hairline/30 bg-background px-4 py-3 text-body font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
        />
      </div>

      <ImageUploader
        label="Profile Photos"
        value={photos}
        onChange={(v) => setPhotos(v as string[])}
        multiple
      />

      {message && (
        <p className="text-sm font-medium text-body/80">{message}</p>
      )}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save Home Content"}
      </Button>
    </div>
  );
}
