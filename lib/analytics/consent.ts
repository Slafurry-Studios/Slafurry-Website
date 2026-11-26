// Shared by the consent banner, the page-view tracker and /api/analytics/track.
// The server checks the same cookie, so declining is enforced even if a client
// pings the endpoint directly.

export const CONSENT_COOKIE = "analytics_consent";
export type ConsentValue = "granted" | "denied";

/** How long a choice is remembered before the banner asks again. */
export const CONSENT_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

/** Fired on window when the visitor makes or changes a choice. */
export const CONSENT_CHANGE_EVENT = "slafurry:consent-change";
/** Fired on window to reopen the banner (footer "Cookie settings" link). */
export const CONSENT_OPEN_EVENT = "slafurry:consent-open";

export function readConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
    ?.split("=")[1];
  return raw === "granted" || raw === "denied" ? raw : null;
}

export function writeConsent(value: ConsentValue): void {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }));
}

/** Global Privacy Control: treat as a standing "no" and don't ask. */
export function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}
