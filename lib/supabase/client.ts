import { createBrowserClient } from "@supabase/ssr";

// Dipakai di client components ("use client") — misal form login admin,
// atau kalau nanti butuh subscribe realtime.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}