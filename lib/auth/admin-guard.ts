import { NextResponse } from "next/server";
import { notFound, redirect } from "next/navigation";
import { resolveAdminUser } from "@/lib/auth/admin-users";
import { getAuthProvider, defaultCookies } from "@/lib/auth/adapter";

export type AdminAuthResult =
  | { ok: true; userId: string; adminUser: { id: string; name: string } }
  | { ok: false; response: NextResponse };

/**
 * Server-side admin check for route handlers.
 *
 * `proxy.ts` only proves the caller has *a* session, and any Supabase account
 * passes it. Admin rights come from the `AdminUser` allowlist, which needs
 * Prisma and so can only be checked here, never in middleware.
 *
 * New admins are provisioned only from the ADMIN_EMAILS allowlist; see
 * lib/auth/admin-users.ts.
 */
export async function authorizeAdmin(): Promise<AdminAuthResult> {
  let user: { id: string; email: string | null } | null = null;
  try {
    user = (await getAuthProvider().getSession(await defaultCookies())).user;
  } catch {
    user = null;
  }
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const adminUser = await resolveAdminUser(user);
  if (!adminUser) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Forbidden: User is not an authorized administrator" },
        { status: 403 }
      ),
    };
  }
  return { ok: true, userId: user.id, adminUser };
}

/**
 * Admin check for server-rendered `/admin/*` pages. A check in the admin layout
 * is not enough: client-side navigations fetch only the page segment, so each
 * page must call this itself.
 *
 * No session → login. Signed in but not allowlisted → 404 (redirecting to the
 * login page would loop, since proxy.ts bounces signed-in users back to /admin).
 */
export async function requireAdminPage(): Promise<{ id: string; name: string }> {
  const auth = await authorizeAdmin();
  if (auth.ok) return auth.adminUser;
  if (auth.response.status === 401) redirect("/admin/login");
  notFound();
}
