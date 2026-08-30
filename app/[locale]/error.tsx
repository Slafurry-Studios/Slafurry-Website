"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { PillButton } from "@/components/ui/PillButton";

// PENTING: error.tsx TIDAK BOLEH bergantung pada NextIntlClientProvider.
// Next.js error boundaries tidak dijamin ke-cover provider dari layout.tsx
// di segment yang sama, kalau errornya kejadian SEBELUM provider itu
// sempat ke-render (misal error di dalam layout.tsx itu sendiri). Makanya
// di sini locale dideteksi manual dari URL, bukan lewat useTranslations.
const DICTIONARY = {
  en: {
    title: "500",
    heading: "Something broke behind the scenes",
    body: "Our server is having a moment. Try again in a bit.",
    tryAgain: "Try again",
    backHome: "Back to Home",
  },
  id: {
    title: "500",
    heading: "Ada yang rusak di belakang layar",
    body: "Server kami lagi bermasalah. Coba lagi sebentar lagi.",
    tryAgain: "Coba lagi",
    backHome: "Kembali ke Beranda",
  },
} as const;

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/id") ? "id" : "en";
  const t = DICTIONARY[locale];

  useEffect(() => {
    // TODO (step 4+): kirim ke error tracking service kalau ada
    // (Sentry/dst). Untuk sekarang log ke console aja.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <SlafurryMark className="h-16 w-16 text-neutral-300 dark:text-neutral-700" />

      <p className="mt-6 font-heading text-7xl tracking-wide text-neutral-300 dark:text-neutral-700">
        {t.title}
      </p>
      <h1 className="mt-1 font-heading text-3xl tracking-wide">{t.heading}</h1>

      <p className="mt-3 max-w-sm font-body text-sm text-neutral-500 dark:text-neutral-400">
        {t.body}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <PillButton onClick={reset} variant="solid">
          {t.tryAgain}
        </PillButton>
        <PillButton href="/">{t.backHome}</PillButton>
      </div>
    </div>
  );
}
