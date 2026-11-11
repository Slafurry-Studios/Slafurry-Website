import { createServiceRoleClient } from "@/lib/supabase/server";

export async function deleteStorageFile(
  publicUrl: string | null | undefined
): Promise<boolean> {
  if (!publicUrl) return false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;

  const prefix = `${supabaseUrl}/storage/v1/object/public/`;
  if (!publicUrl.startsWith(prefix)) return false;

  const remainder = publicUrl.slice(prefix.length);
  const slash = remainder.indexOf("/");
  if (slash === -1) return false;

  const bucket = remainder.slice(0, slash);
  const path = remainder.slice(slash + 1);

  const supabase = createServiceRoleClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return !error;
}
