import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { StorageProvider, StorageFile, UploadResult } from "./adapter";

function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SECRET_KEY!;
  return createSupabaseClient(url, key);
}

function publicUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

function parsePublicUrl(publicUrl: string): { bucket: string; path: string } | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  const prefix = `${supabaseUrl}/storage/v1/object/public/`;
  if (!publicUrl.startsWith(prefix)) return null;
  const remainder = publicUrl.slice(prefix.length);
  const slash = remainder.indexOf("/");
  if (slash === -1) return null;
  return { bucket: remainder.slice(0, slash), path: remainder.slice(slash + 1) };
}

export class SupabaseStorageProvider implements StorageProvider {
  async upload({ file, bucket, path }: { file: StorageFile; bucket: string; path?: string }): Promise<UploadResult> {
    const finalPath = path ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${file.name.split(".").pop() ?? "bin"}`;
    const supabase = createServiceRoleClient();
    const { error } = await supabase.storage.from(bucket).upload(finalPath, file.buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(error.message ?? "Upload failed");
    return { url: publicUrl(bucket, finalPath), path: finalPath };
  }

  getUrl(bucket: string, path: string): string {
    return publicUrl(bucket, path);
  }

  async delete(publicUrl: string | null | undefined): Promise<boolean> {
    if (!publicUrl) return false;
    const parsed = parsePublicUrl(publicUrl);
    if (!parsed) return false;
    const supabase = createServiceRoleClient();
    const { error } = await supabase.storage.from(parsed.bucket).remove([parsed.path]);
    return !error;
  }
}
