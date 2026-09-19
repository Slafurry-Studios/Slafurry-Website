import { createServiceRoleClient } from "./server";

export async function deleteStorageFile(publicUrl: string | null | undefined) {
  if (!publicUrl) return false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error("deleteStorageFile: NEXT_PUBLIC_SUPABASE_URL is missing.");
    return false;
  }

  const prefix = `${supabaseUrl}/storage/v1/object/public/`;

  if (!publicUrl.startsWith(prefix)) {
    console.warn("deleteStorageFile: URL does not match Supabase prefix.", publicUrl);
    return false;
  }

  const remainder = publicUrl.substring(prefix.length); // "bucket/path/to/file.ext"
  const slashIndex = remainder.indexOf("/");
  
  if (slashIndex === -1) return false;

  const bucket = remainder.substring(0, slashIndex);
  const path = remainder.substring(slashIndex + 1);

  if (!bucket || !path) return false;

  const supabase = createServiceRoleClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("deleteStorageFile error:", error);
    return false;
  }

  return true;
}
