import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Jalanin locale routing dulu (redirect /foo -> /en/foo kalau perlu,
  //    nentuin locale dari Accept-Language header, dst).
  const response = intlMiddleware(request);

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

  // 3. Proteksi /admin/* — semua path yang mengandung segment "admin"
  //    (setelah locale prefix, misal /en/admin/games) butuh session valid,
  //    kecuali halaman login itu sendiri.
  const pathnameWithoutLocale = request.nextUrl.pathname.replace(
    /^\/(en|id)/,
    ""
  );
  const isAdminRoute = pathnameWithoutLocale.startsWith("/admin");
  const isLoginRoute = pathnameWithoutLocale.startsWith("/admin/login");

  if (isAdminRoute && !isLoginRoute && !user) {
    const locale = request.nextUrl.pathname.split("/")[1] || routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    return NextResponse.redirect(loginUrl);
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