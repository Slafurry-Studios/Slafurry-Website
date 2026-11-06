import { LocalStorageProvider } from "./local";
import { SupabaseStorageProvider } from "./supabase";

export type StorageFile = {
  buffer: Buffer;
  name: string;
  type: string;
};

export type UploadResult = { url: string; path: string };

export interface StorageProvider {
  upload(args: { file: StorageFile; bucket: string; path?: string }): Promise<UploadResult>;
  getUrl(bucket: string, path: string): string;
  delete(publicUrl: string | null | undefined): Promise<boolean>;
}

let provider: StorageProvider | null = null;

export function setStorageProvider(p: StorageProvider): void {
  provider = p;
}

export function getStorageProvider(): StorageProvider {
  if (provider) return provider;
  provider = process.env.STORAGE_PROVIDER === "local"
    ? new LocalStorageProvider()
    : new SupabaseStorageProvider();
  return provider;
}

// Backward-compatible wrapper used by existing admin routes.
export async function deleteStorageFile(publicUrl: string | null | undefined): Promise<boolean> {
  return getStorageProvider().delete(publicUrl);
}

export const LOCAL_STORAGE_ROOT = "./.local-storage";
