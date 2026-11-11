"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";
import Image from "next/image";
import {
  IconUpload,
  IconX,
  IconLoader2,
  IconAlertCircle,
  IconPhoto,
} from "@tabler/icons-react";

export type Bucket =
  | "game-covers"
  | "post-covers"
  | "press-kit"
  | "montage-videos";

export type ImageUploaderValue = {
  url: string;
  altText: string;
};

type Props = {
  bucket: Bucket;
  value: ImageUploaderValue | null;
  onChange: (val: ImageUploaderValue | null) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
};

export function ImageUploader({
  bucket,
  value,
  onChange,
  label,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = 10,
  className = "",
}: Props) {
  const [preview, setPreview] = useState<string | null>(value?.url ?? null);
  const [altText, setAltText] = useState(value?.altText ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const doUpload = useCallback(
    async (file: File) => {
      setError("");
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Max size is ${maxSizeMB} MB.`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }

      // Local preview
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      // Generate alt text suggestion from filename
      const suggestedAlt = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]+/g, " ");
      setAltText((prev) => prev || suggestedAlt);

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", bucket);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Upload failed.");
          setPreview(value?.url ?? null);
          setUploading(false);
          return;
        }

        setPreview(data.url);
        const finalAlt = altText.trim() || data.altText;
        onChange({ url: data.url, altText: finalAlt });
      } catch {
        setError("Network error during upload.");
        setPreview(value?.url ?? null);
      } finally {
        setUploading(false);
      }
    },
    [bucket, maxSizeMB, altText, value, onChange]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  }

  function handleClear() {
    setPreview(null);
    setAltText("");
    setError("");
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleAltChange(newAlt: string) {
    setAltText(newAlt);
    if (value?.url) {
      onChange({ url: value.url, altText: newAlt });
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium">{label}</label>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging
            ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900"
            : "border-neutral-300 hover:border-neutral-500 dark:border-neutral-700 dark:hover:border-neutral-500"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <>
            <IconLoader2 size={24} className="animate-spin text-neutral-400" />
            <span className="text-xs text-neutral-500">Uploading...</span>
          </>
        ) : preview ? (
          <div className="relative w-full max-w-xs">
            <Image
              src={preview}
              alt={altText || "Preview"}
              width={400}
              height={300}
              className="mx-auto max-h-48 rounded-lg object-contain"
              unoptimized
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute -right-2 -top-2 rounded-full bg-neutral-900 p-1 text-white shadow-lg transition-colors hover:bg-red-600 dark:bg-white dark:text-neutral-900 dark:hover:bg-red-600 dark:hover:text-white"
            >
              <IconX size={12} />
            </button>
          </div>
        ) : (
          <>
            <IconPhoto size={24} className="text-neutral-400" />
            <span className="text-xs text-neutral-500">
              Drag &amp; drop or click to upload
            </span>
            <span className="text-[10px] text-neutral-400">
              JPEG, PNG, WebP — max {maxSizeMB} MB
            </span>
          </>
        )}
      </div>

      {/* Alt text input — always visible when there's a value */}
      {preview && (
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Alt Text <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => handleAltChange(e.target.value)}
            placeholder="Describe this image (required for accessibility)"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white dark:focus:ring-white"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <IconAlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
