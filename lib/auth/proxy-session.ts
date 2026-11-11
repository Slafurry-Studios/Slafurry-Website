// Prisma-free session lookup for `proxy.ts` (Next.js middleware).
//
// Middleware is bundled separately and must not pull in Prisma: its native
// query engine (.node addon) is unsupported in middleware on Netlify. The full
// auth providers in ./providers/* import Prisma (for AdminUser lookups), so the
// proxy uses this module instead. Keep it free of any `@/lib/prisma` import.
import { createClient } from "@/lib/supabase/server";
import { verifySession } from "./session";
import type { CookieStore, SessionResult } from "./adapter";

const LOCAL_SESSION_NAME = "slafurry_local_session";

function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || !!process.env.VERCEL;
}

async function getLocalSession(cookies: CookieStore): Promise<SessionResult> {
  if (isProduction()) {
    throw new Error(
      "Local auth provider cannot be active in production. Set AUTH_PROVIDER=supabase."
    );
  }
  const secret = process.env.AUTH_LOCAL_SECRET;
  if (!secret || secret === "dev-local-secret-placeholder" || secret === "your-secret-here") {
    throw new Error("AUTH_LOCAL_SECRET not set (use `openssl rand -base64 32`).");
  }
  const value = cookies.getAll().find((c) => c.name === LOCAL_SESSION_NAME)?.value;
  if (!value) return { user: null };
  const payload = verifySession<{ id: string; email?: string; name?: string }>(value, secret);
  if (!payload) return { user: null };
  return {
    user: { id: payload.id, email: payload.email ?? null, name: payload.name ?? null },
  };
}

async function getSupabaseSession(cookies: CookieStore): Promise<SessionResult> {
  const supabase = createClient(cookies);
  const { data } = await supabase.auth.getUser();
  return {
    user: data.user ? { id: data.user.id, email: data.user.email ?? null, name: null } : null,
  };
}

export function getProxySession(cookies: CookieStore): Promise<SessionResult> {
  return process.env.AUTH_PROVIDER === "local"
    ? getLocalSession(cookies)
    : getSupabaseSession(cookies);
}
