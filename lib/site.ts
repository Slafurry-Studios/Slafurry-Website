/** Canonical public origin, without a trailing slash. Used for absolute URLs (OG images, RSS). */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://slafurrystudios.com").replace(/\/+$/, "");
