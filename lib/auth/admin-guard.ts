import { NextResponse } from "next/server";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
 * Bootstrap: while the AdminUser table is empty, the first signed-in user is
 * provisioned as admin (the seed creates one, so this only matters on a fresh DB).
 */
export async function authorizeAdmin(): Promise<AdminAuthResult> {
  let userId: string | null = null;
  try {
    const session = await getAuthProvider().getSession(await defaultCookies());
    userId = session.user?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  let adminUser = await prisma.adminUser.findUnique({ where: { supabaseUserId: userId } });
  if (!adminUser) {
    const adminCount = await prisma.adminUser.count();
    if (adminCount !== 0) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Forbidden: User is not an authorized administrator" },
          { status: 403 }
        ),
      };
    }
    adminUser = await prisma.adminUser.create({
      data: { supabaseUserId: userId, name: "Initial Admin" },
    });
  }

  return { ok: true, userId, adminUser: { id: adminUser.id, name: adminUser.name } };
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
