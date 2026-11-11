"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

function getCookie(name: string): string | null {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1] ?? null;
}

export function CookieConsentBanner() {
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = getCookie("cookie_consent");

      if (consent) {
        setShowBanner(false);
      }
      setHasHydrated(true);
    };

    checkConsent();
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg pointer-events-auto"
    >
      <div
        className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-700 slide-up"
        role="document"
      >
        <div className="flex flex-col gap-4">
          <p className="text-neutral-700 dark:text-neutral-300 text-sm font-display leading-relaxed">
            We use functional cookies to remember your theme and preferences, and
            optional analytics cookies to understand how the site is used.
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                document.cookie = "cookie_consent=accept; path=/";
                router.push("/");
              }}
              className="flex-1 px-6 py-3 bg-neutral-900 text-white font-display font-medium rounded-lg hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Accept
            </button>
            <button
              onClick={() => {
                document.cookie = "cookie_consent=reject; path=/";
                router.push("/");
              }}
              className="flex-1 px-6 py-3 text-neutral-900 font-display font-medium rounded-lg hover:bg-neutral-200 dark:text-white dark:hover:bg-white dark:hover:text-neutral-900"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
