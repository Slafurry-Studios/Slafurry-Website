"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_OPEN_EVENT,
  hasGlobalPrivacyControl,
  readConsent,
  writeConsent,
  type ConsentValue,
} from "@/lib/analytics/consent";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
}
const clientSnapshot = () => readConsent() ?? "unset";
// On the server (and during hydration) we can't read the cookie: render nothing,
// so the banner never flashes for visitors who already chose.
const serverSnapshot = () => "server" as const;

/**
 * Asks once whether we may count page visits. Nothing is tracked until the
 * visitor accepts. Hidden for visitors who send Global Privacy Control.
 */
export function ConsentBanner() {
  const consent = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const firstVisit = consent === "unset" && !hasGlobalPrivacyControl();
  if (consent === "server" || !(firstVisit || reopened)) return null;

  const choose = (value: ConsentValue) => {
    writeConsent(value);
    setReopened(false);
  };

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl sm:bottom-6"
    >
      <div className="pixel-dark-frame slide-up px-4 py-4 text-white sm:px-6">
        <p className="font-display text-base leading-relaxed sm:text-lg">
          Can we count your visit?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-300">
          We&apos;d like to record which pages get visited, the site that sent you here and your
          device type (phone, tablet or desktop). No accounts, no ad trackers, no third parties.
          You can change this anytime from &ldquo;Cookie settings&rdquo; in the footer.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => choose("granted")}
            className="pixel-border-white flex-1 px-4 py-3 font-display text-base text-white transition-transform hover:scale-[1.02]"
          >
            <span className="relative z-20">Sure</span>
          </button>
          <button
            type="button"
            onClick={() => choose("denied")}
            className="pixel-border-white flex-1 px-4 py-3 font-display text-base text-neutral-300 transition-transform hover:scale-[1.02]"
          >
            <span className="relative z-20">No thanks</span>
          </button>
        </div>
      </div>
    </div>
  );
}
