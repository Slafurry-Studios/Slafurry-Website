"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { PillButton } from "@/components/ui/PillButton";

// Error boundary untuk segmen (main). Tidak bergantung pada i18n — situs
// bahasa tunggal (English). Teks dalam bahasa yang saat ini tampil di situs.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // TODO (step 4+): kirim ke error tracking service kalau ada
    // (Sentry/dst). Untuk sekarang log ke console aja.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <SlafurryMark className="h-16 w-16 text-neutral-300 dark:text-neutral-700" />

      <p className="mt-6 font-heading text-7xl tracking-wide text-neutral-300 dark:text-neutral-700">
        500
      </p>
      <h1 className="mt-1 font-heading text-3xl tracking-wide">
        Something broke behind the scenes
      </h1>

      <p className="mt-3 max-w-sm font-body text-xl text-neutral-500 dark:text-neutral-400">
        Our server is having a moment. Try again in a bit.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <PillButton onClick={reset} variant="solid">
          Try again
        </PillButton>
        <PillButton href="/">Back to Home</PillButton>
      </div>
    </div>
  );
}
