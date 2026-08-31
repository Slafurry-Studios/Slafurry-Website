import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Jalanin locale routing dulu (redirect /foo -> /en/foo kalau perlu,
  //    nentuin locale dari Accept-Language header, dst).
  let response = intlMiddleware(request);

  // 2. Refresh session Supabase — WAJIB dipanggil di tiap request biar
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

  // 3. Redirect lookup — check for stale slugs before they hit 404.
  //    `from` stores paths WITHOUT locale prefix (e.g. "/devlog/old-slug").
  //    Wrapped in try-catch: if the DB is unreachable, skip the lookup
  //    instead of crashing every request on the site.
  const pathnameWithoutLocale = request.nextUrl.pathname.replace(
    /^\/(en|id)/,
    ""
  );

  try {
    const redirect = await prisma.redirect.findUnique({
      where: { from: pathnameWithoutLocale },
    });

    if (redirect) {
      const locale =
        request.nextUrl.pathname.split("/")[1] || routing.defaultLocale;
      const dest = redirect.to.startsWith(`/${locale}/`)
        ? redirect.to
        : `/${locale}${redirect.to.startsWith("/") ? "" : "/"}${redirect.to}`;
      return NextResponse.redirect(new URL(dest, request.url), {
        status: 308,
      });
    }
  } catch {
    // DB unreachable — skip redirect lookup, continue to the page.
    // The catch-all [...rest]/page.tsx will handle 404 if needed.
  }

  // 4. Admin route matching.
  const isAdminRoute = pathnameWithoutLocale.startsWith("/admin");
  const isLoginRoute = pathnameWithoutLocale.startsWith("/admin/login");

  // 5. Protect /admin/* — need valid session, except login page.
  if (isAdminRoute && !isLoginRoute && !user) {
    const locale =
      request.nextUrl.pathname.split("/")[1] || routing.defaultLocale;
    const returnTo = request.nextUrl.pathname;
    const loginUrl = new URL(
      `/${locale}/admin/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`,
      request.url
    );
    // Carry cookies from intl middleware (e.g. NEXT_LOCALE) into the redirect
    // so they aren't lost when we replace the response.
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((c) =>
      redirectResponse.cookies.set(c.name, c.value, c)
    );
    return redirectResponse;
  }

  // 6. If already logged in and hitting /admin/login, redirect to /admin
  //    (or the returnTo destination).
  if (isLoginRoute && user) {
    const locale =
      request.nextUrl.pathname.split("/")[1] || routing.defaultLocale;
    const returnTo = request.nextUrl.searchParams.get("returnTo");
    const dest = returnTo && returnTo.startsWith(`/${locale}/admin`)
      ? returnTo
      : `/${locale}/admin`;
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  // Matcher ini exclude static assets, API routes yang gak butuh locale
  // (analytics tracking, achievement redeem), dan file dengan ekstensi.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sfx|.*\\..*).*)",
  ],
};
