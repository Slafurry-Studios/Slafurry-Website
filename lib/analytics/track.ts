// Pure helpers for /api/analytics/track, kept separate so they are unit-tested.

// Public pages worth counting. i18n was removed, so there is no `/en` prefix.
const TRACKED_PATH = /^\/(?:(?:games|devlog|news)(?:\/[a-z0-9-]+)?|press|contact)?$/;

export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function isTrackedPath(pathname: string): boolean {
  return TRACKED_PATH.test(pathname);
}

const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|curl|wget|python-requests/i;

export function isBot(userAgent: string | null): boolean {
  return !userAgent || BOT_UA.test(userAgent);
}

/** Coarse device class from the User-Agent; the client's own claim is not trusted. */
export function classifyDevice(userAgent: string | null): "mobile" | "tablet" | "desktop" {
  const ua = userAgent ?? "";
  if (/iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)/i.test(ua)) return "tablet";
  if (/Mobi|iPhone|iPod|Android|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

/**
 * Reduce a referrer URL to the referring site's hostname. Full referrer URLs
 * can carry search terms or tokens in the query string, so they are never
 * stored. Internal referrers (our own host) and unparseable values become null.
 */
export function referrerHost(referrer: string, siteHost: string | null): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const own = (siteHost ?? "").toLowerCase().split(":")[0].replace(/^www\./, "");
    if (!host || host === own) return null;
    return host.slice(0, 255);
  } catch {
    return null;
  }
}
