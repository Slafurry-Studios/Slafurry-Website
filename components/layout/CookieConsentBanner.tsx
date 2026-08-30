"use client";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";

import { useMessages } from "next-intl";

export function CookieConsentBanner({
  onConsentChange,
}: {
  onConsentChange: (consent: "accept" | "reject") => void;
}) {
  const [showBanner, setShowBanner] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { t } = useMessages();

  useEffect(() => {
    const checkConsent = async () => {
      const cookieStore = await cookies();
      const consent = cookieStore.get("cookie_consent")?.value;

      if (consent) {
        setShowBanner(false);
        onConsentChange(consent as "accept" | "reject");
      }
      setHasHydrated(true);
    };

    checkConsent();
  }, [onConsentChange]);

  if (!showBanner || hasHydrated) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center z-50 bg-neutral-900/80 bg-opacity-80 backdrop-blur-sm"
    >
      <div
        role="document"
        className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-8 max-w-sm w-full mx-4 transform transition-transform scale-100"
      >
        <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-6 line-height-relaxed">
          {t("cookieConsent.text")}
        </p>

        <div className="flex gap-4 justify-end">
          <button
            onClick={async () => {
              const cookieStore = await cookies();
              cookieStore.set("cookie_consent", "accept");
              onConsentChange("accept");
              redirect("/");
            }}
            className="px-6 py-3 rounded-full border bg-neutral-900 text-white font-body font-medium hover:bg-neutral-700 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {t("cookieConsent.accept")}
          </button>
          <button
            onClick={async () => {
              const cookieStore = await cookies();
              cookieStore.set("cookie_consent", "reject");
              onConsentChange("reject");
              redirect("/");
            }}
            className="px-6 py-3 rounded-full border border-neutral-900 text-neutral-900 font-body font-medium hover:bg-neutral-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-neutral-900"
          >
            {t("cookieConsent.reject")}
          </button>
        </div>
      </div>
    </div>
  );
}