import { prisma } from "@/lib/prisma";

/** Lower-cased emails from ADMIN_EMAILS (comma separated). */
export function adminEmailAllowlist(raw = process.env.ADMIN_EMAILS): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

/**
 * The AdminUser row for a signed-in user, or null if they are not an admin.
 *
 * Existing AdminUser rows always count. A user without a row is provisioned
 * only when their email is listed in ADMIN_EMAILS. There is no "first user
 * becomes admin" fallback: an empty AdminUser table must not hand admin to
 * whoever signs in first.
 */
export async function resolveAdminUser(user: {
  id: string;
  email: string | null;
  name?: string | null;
}): Promise<{ id: string; name: string } | null> {
  const existing = await prisma.adminUser.findUnique({ where: { supabaseUserId: user.id } });
  if (existing) return { id: existing.id, name: existing.name };

  const email = user.email?.trim().toLowerCase();
  if (!email || !adminEmailAllowlist().has(email)) return null;

  const created = await prisma.adminUser.upsert({
    where: { supabaseUserId: user.id },
    update: {},
    create: { supabaseUserId: user.id, name: user.name || email },
  });
  return { id: created.id, name: created.name };
}
