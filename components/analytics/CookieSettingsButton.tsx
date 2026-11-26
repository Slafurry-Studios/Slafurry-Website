"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/analytics/consent";

/** Reopens the consent banner so visitors can change their analytics choice. */
export function CookieSettingsButton({
  className = "",
  children = "Cookie settings",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className={`underline underline-offset-2 hover:opacity-80 ${className}`}
    >
      {children}
    </button>
  );
}
