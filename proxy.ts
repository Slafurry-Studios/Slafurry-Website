import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Refresh session Supabase — WAJIB dipanggil di tiap request biar
  //    token gak expired diam-diam pas admin lagi kerja lama.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Admin API guard — /api/admin/* ditulis pakai service-role key, jadi
  //    wajib ada session valid. Balikin 401 JSON (bukan redirect) biar
  //    client fetch() bisa handle, gak dapet HTML halaman login.
  const pathname = request.nextUrl.pathname;
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminApi) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return response;
  }

  // 3. Redirect lookup — check for stale slugs before they hit 404.
  //    Wrapped in try-catch: if the DB is unreachable, skip the lookup
  //    instead of crashing every request on the site.
  try {
    const redirect = await prisma.redirect.findUnique({
      where: { from: pathname },
    });

    if (redirect) {
      const dest = redirect.to.startsWith("/") ? redirect.to : `/${redirect.to}`;
      return NextResponse.redirect(new URL(dest, request.url), {
        status: 308,
      });
    }
  } catch {
    // DB unreachable — skip redirect lookup, continue to the page.
    // The catch-all [...rest]/page.tsx will handle 404 if needed.
  }

  // 4. Admin route matching.
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/admin/login");

  // 5. Protect /admin/* — need valid session, except login page.
  if (isAdminRoute && !isLoginRoute && !user) {
    const returnTo = request.nextUrl.pathname;
    const loginUrl = new URL(
      `/admin/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`,
      request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  // 6. If already logged in and hitting /admin/login, redirect to /admin
  //    (or the returnTo destination).
  if (isLoginRoute && user) {
    const returnTo = request.nextUrl.searchParams.get("returnTo");
    const dest = returnTo && returnTo.startsWith(`/admin`)
      ? returnTo
      : `/admin`;
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  // Matcher exclude static assets, API routes yang gak butuh redirect checks,
  // dan file dengan ekstensi. /api/admin/* TETAP di-match (lihat negative
  // lookahead `api/(?!admin)`) biar session guard di atas jalan.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sfx|api/(?!admin)|.*\\..*).*)",
  ],
};
