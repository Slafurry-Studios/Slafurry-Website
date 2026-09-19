import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next();

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

  // 2. Redirect lookup — check for stale slugs before they hit 404.
  //    Wrapped in try-catch: if the DB is unreachable, skip the lookup
  //    instead of crashing every request on the site.
  const pathname = request.nextUrl.pathname;

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

  // 3. Admin route matching.
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/admin/login");

  // 4. Protect /admin/* — need valid session, except login page.
  if (isAdminRoute && !isLoginRoute && !user) {
    const returnTo = request.nextUrl.pathname;
    const loginUrl = new URL(
      `/admin/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`,
      request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  // 5. If already logged in and hitting /admin/login, redirect to /admin
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
  // Matcher ini exclude static assets, API routes yang gak butuh redirect checks,
  // dan file dengan ekstensi.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sfx|.*\\..*).*)",
  ],
};
