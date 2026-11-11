import { NextResponse, type NextRequest } from "next/server";
import { getAuthProvider, type CookieStore } from "@/lib/auth/adapter";
import { prisma } from "@/lib/prisma";

function buildCookieStore(request: NextRequest, response: NextResponse): CookieStore {
  return {
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet) => {
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options);
      }
    },
  };
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Refresh session + get user via auth adapter (not Supabase directly).
  const provider = getAuthProvider();
  const cookies = buildCookieStore(request, response);
  const { user } = await provider.getSession(cookies);

  // 2. Admin API guard — /api/admin/* needs valid session. Return 401 JSON.
  const pathname = request.nextUrl.pathname;
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminApi) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return response;
  }

  // 3. Redirect lookup — check stale slugs before 404.
  try {
    const redirect = await prisma.redirect.findUnique({
      where: { from: pathname },
    });

    if (redirect) {
      const dest = redirect.to.startsWith("/") ? redirect.to : `/${redirect.to}`;
      return NextResponse.redirect(new URL(dest, request.url), { status: 308 });
    }
  } catch {
    // DB unreachable — skip redirect lookup.
  }

  // 4. Admin route matching.
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/admin/login");

  // 5. Protect /admin/* — needs valid session, except login page.
  if (isAdminRoute && !isLoginRoute && !user) {
    const returnTo = request.nextUrl.pathname;
    const loginUrl = new URL(
      `/admin/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`,
      request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  // 6. Already logged in and opening /admin/login → redirect to /admin.
  if (isLoginRoute && user) {
    const returnTo = request.nextUrl.searchParams.get("returnTo");
    const dest = returnTo && returnTo.startsWith(`/admin`) ? returnTo : `/admin`;
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sfx|api/(?!admin)|.*\\..*).*)",
  ],
};
