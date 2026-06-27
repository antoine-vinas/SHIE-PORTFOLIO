# Shie's Portfolio

A responsive portfolio website for a visual storyteller / creative producer, built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Public site** — Home/about page with animated wordmark, bio section, and six category gallery pages
- **Project galleries** — Responsive grids with modal detail views (images + optional video)
- **Admin dashboard** — Password-protected content management at `/admin`
- **Live updates** — All content is fetched from Supabase; no redeploy needed after edits

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Add font files

Place these files in `public/fonts/`:

- `Birds_of_Paradise.ttf`
- `HelveticaNeueMedium.otf`
- `HelveticaNeueBold.otf`

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your keys
3. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor
4. Create a **Storage** bucket named `project-images` (public)
5. Add storage policies from the comments at the bottom of `schema.sql`
6. Create an admin user: **Authentication → Users → Add user** (email + password)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Guide

### Logging in

1. Go to `/admin/login`
2. Sign in with the email and password you created in Supabase Auth

### Adding a project

1. Click **+ New Project**
2. Fill in title, category, description, and upload a cover image
3. Optionally add more images and a YouTube/Vimeo video URL
4. Click **Create Project**

The project appears immediately on the matching gallery page.

### Editing or deleting

- Click **Edit** on any project in the list
- Click **Delete** to remove (you'll be asked to confirm)

### Reordering

1. Select a category from the dropdown
2. Drag projects using the ⠿ handle on the left
3. Order saves automatically

### Home page content

1. Click the **Home Page** tab in admin
2. Edit the bio text and upload profile photos
3. Click **Save Home Content**

## Image uploads

Images uploaded through the admin dashboard are automatically:

- Resized to a max width of 1920px
- Converted to WebP for faster loading
- Stored in Supabase Storage

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Postgres, Storage, Auth)
- @dnd-kit (drag-and-drop reorder)
- sharp (image optimization)

## Deploy

Deploy to Vercel (or any Node.js host) and set the same environment variables from `.env.local`.

Ensure your Supabase project's **Site URL** and **Redirect URLs** include your production domain under Authentication settings.
