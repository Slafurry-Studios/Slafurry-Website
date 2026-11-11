import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs";
import { join, basename } from "path"; // turbopackIgnore: true
import type { StorageProvider, StorageFile, UploadResult } from "./adapter";

const ROOT = process.env.LOCAL_STORAGE_ROOT ?? "./.local-storage";

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function publicUrl(bucket: string, path: string): string {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${appUrl}/local-storage/${bucket}/${path}`;
}

function parsePublicUrl(publicUrl: string): { bucket: string; path: string } | null {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const prefix = `${appUrl}/local-storage/`;
  if (!publicUrl.startsWith(prefix)) return null;
  const remainder = publicUrl.slice(prefix.length);
  const slash = remainder.indexOf("/");
  if (slash === -1) return null;
  return { bucket: remainder.slice(0, slash), path: remainder.slice(slash + 1) };
}

function diskPath(bucket: string, path: string): string {
  return `${ROOT}/${bucket}/${path}`;
}

export class LocalStorageProvider implements StorageProvider {
  async upload({ file, bucket, path }: { file: StorageFile; bucket: string; path?: string }): Promise<UploadResult> {
    const finalPath = path ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${basename(file.name)}`;
    const full = diskPath(bucket, finalPath);
    ensureDir(`${ROOT}/${bucket}`); // turbopackIgnore: true
    writeFileSync(full, file.buffer); // turbopackIgnore: true
    return { url: publicUrl(bucket, finalPath), path: finalPath };
  }

  getUrl(bucket: string, path: string): string {
    return publicUrl(bucket, path);
  }

  async delete(publicUrl: string | null | undefined): Promise<boolean> {
    if (!publicUrl) return false;
    const parsed = parsePublicUrl(publicUrl);
    if (!parsed) return false;
    const full = diskPath(parsed.bucket, parsed.path); // turbopackIgnore: true
    if (!existsSync(full)) return false; // turbopackIgnore: true
    try {
      unlinkSync(full); // turbopackIgnore: true
      return true;
    } catch {
      return false;
    }
  }
}
