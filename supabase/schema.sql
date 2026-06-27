-- Shie's Portfolio — Supabase schema
-- Run this in the Supabase SQL Editor for a new project.

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'production-managing',
      'publication-materials',
      'branding-work',
      'personal-work',
      'photography',
      'videography'
    )
  ),
  description TEXT,
  cover_image_url TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  video_url TEXT,
  project_date DATE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects (category, display_order);

-- Site content (home page bio, profile photos)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default home content
INSERT INTO site_content (key, value)
VALUES (
  'home',
  '{
    "bio": "I''m a visual storyteller and creative producer who brings ideas to life across production, publication, branding, and personal projects. From concept to final delivery, I craft narratives that resonate — blending strategy, aesthetics, and meticulous attention to detail.",
    "profile_photos": []
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Public can read site content"
  ON site_content FOR SELECT
  USING (true);

-- Authenticated users can manage content
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update site content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Storage bucket (create via Supabase Dashboard or API)
-- Bucket name: project-images
-- Public: true
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- Storage policies (run after creating the bucket):
-- CREATE POLICY "Public read access"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'project-images');

-- CREATE POLICY "Authenticated upload"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'project-images');

-- CREATE POLICY "Authenticated update"
--   ON storage.objects FOR UPDATE
--   TO authenticated
--   USING (bucket_id = 'project-images');

-- CREATE POLICY "Authenticated delete"
--   ON storage.objects FOR DELETE
--   TO authenticated
--   USING (bucket_id = 'project-images');
