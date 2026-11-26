"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_CHANGE_EVENT,
  hasGlobalPrivacyControl,
  readConsent,
} from "@/lib/analytics/consent";

function send(path: string, referrer: string) {
  const body = JSON.stringify({ path, referrer });
  const blob = new Blob([body], { type: "application/json" });
  if (navigator.sendBeacon?.("/api/analytics/track", blob)) return;
  void fetch("/api/analytics/track", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {});
}

/**
 * Sends one page view per route change, only after the visitor has accepted
 * analytics. Uses usePathname only: useSearchParams would need a <Suspense>
 * boundary in the (main) layout, which breaks 404 status codes (see CLAUDE.md).
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);
  const firstView = useRef(true);

  useEffect(() => {
    const track = () => {
      if (readConsent() !== "granted" || hasGlobalPrivacyControl()) return;
      if (lastSent.current === pathname) return;
      lastSent.current = pathname;
      // document.referrer only describes the first page of a visit; later
      // client-side navigations are internal.
      send(pathname, firstView.current ? document.referrer : "");
      firstView.current = false;
    };

    track();
    window.addEventListener(CONSENT_CHANGE_EVENT, track);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, track);
  }, [pathname]);

  return null;
}
