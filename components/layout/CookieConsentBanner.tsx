"use client";

import { useEffect, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { redirect } from "@/i18n/navigation";

function getCookie(name: string): string | null {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1] ?? null;
}

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);
  const t = useTranslations("cookieConsent");
  const locale = useLocale();

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
          {t("text")}
        </p>

        <div className="flex gap-4 justify-end">
          <button
            onClick={() => {
              document.cookie = "cookie_consent=accept; path=/";
              redirect({ href: "/", locale });
            }}
            className="px-6 py-3 rounded-full border bg-neutral-900 text-white font-body font-medium hover:bg-neutral-700 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {t("accept")}
          </button>
          <button
            onClick={() => {
              document.cookie = "cookie_consent=reject; path=/";
              redirect({ href: "/", locale });
            }}
            className="px-6 py-3 rounded-full border border-neutral-900 text-neutral-900 font-body font-medium hover:bg-neutral-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-neutral-900"
          >
            {t("reject")}
          </button>
        </div>
      </div>
    </div>
  );
}