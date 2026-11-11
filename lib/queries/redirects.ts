import { permanentRedirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Looks up a stored Redirect for `pathname` and issues a 308 if one exists.
 * Called right before `notFound()` so stale slugs resolve to their new URL.
 * (This used to live in proxy.ts, but middleware cannot use Prisma on Netlify.)
 */
export async function followStoredRedirect(pathname: string): Promise<void> {
  let to: string | null = null;
  try {
    const redirect = await prisma.redirect.findUnique({ where: { from: pathname } });
    to = redirect?.to ?? null;
  } catch {
    // DB unreachable — skip redirect lookup.
  }
  if (to) permanentRedirect(to.startsWith("/") ? to : `/${to}`);
}
