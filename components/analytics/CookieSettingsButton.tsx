"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/analytics/consent";

/** Reopens the consent banner so visitors can change their analytics choice. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="underline underline-offset-2 hover:text-white"
    >
      Cookie settings
    </button>
  );
}
