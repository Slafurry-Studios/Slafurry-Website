const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function isUnsafeMethod(method: string): boolean {
  return !SAFE_METHODS.has(method.toUpperCase());
}

/**
 * Reject requests a browser marks as cross-site, or whose Origin does not match
 * the current Host. Same-origin, `none` (user-initiated), and clients that send
 * no Fetch-Metadata/Origin headers are allowed.
 */
export function isCrossSiteRequest(headers: {
  get(name: string): string | null;
}): boolean {
  const fetchSite = headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return true;

  const origin = headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host !== headers.get("host");
    } catch {
      return true;
    }
  }

  return false;
}
