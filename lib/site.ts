/**
 * Canonical public origin, without a trailing slash. Used for absolute URLs
 * (OG images, RSS, sitemap). The apex domain 308-redirects to www, so www is
 * canonical; set NEXT_PUBLIC_APP_URL to the www origin in production too.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://www.slafurrystudios.com").replace(/\/+$/, "");
