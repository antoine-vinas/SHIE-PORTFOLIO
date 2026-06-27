"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  label: string;
  value: string | string[];
  onChange: (url: string | string[]) => void;
  multiple?: boolean;
}

export function ImageUploader({
  label,
  value,
  onChange,
  multiple = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urls = useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value]
  );

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Upload failed");
    }

    const data = await res.json();
    return data.url as string;
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;

      setUploading(true);
      setError(null);

      try {
        const uploaded: string[] = [];
        for (const file of Array.from(files)) {
          const url = await uploadFile(file);
          uploaded.push(url);
        }

        if (multiple) {
          onChange([...urls, ...uploaded]);
        } else {
          onChange(uploaded[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [multiple, onChange, urls]
  );

  const removeImage = (index: number) => {
    if (multiple) {
      onChange(urls.filter((_, i) => i !== index));
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="block font-sans text-sm font-bold text-heading">
        {label}
      </label>

      <div
        className="relative rounded-card border-2 border-dashed border-hairline/30 bg-background/50 p-6 text-center transition-colors hover:border-accent/40"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-accent/50");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("border-accent/50");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-accent/50");
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
        <p className="font-sans font-medium text-body text-sm">
          {uploading
            ? "Uploading & optimizing…"
            : "Drag & drop images here, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-body/50">
          Images are auto-resized and converted to WebP
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-400 font-medium">{error}</p>
      )}

      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {urls.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative aspect-square rounded-lg overflow-hidden border border-hairline/20 group"
            >
              <Image
                src={url}
                alt={`Upload ${i + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-heading opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
