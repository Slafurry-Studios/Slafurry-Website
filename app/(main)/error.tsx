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
https://github.com/muhammadzaini213/Slafurry-Website-Staging/pull/1/conflict?name=app%252F%2528main%2529%252Ferror.tsx&ancestor_oid=3858aa7d9719b766575e8470994499667be0b4b9&base_oid=543e3642905fb9954f3f871bd75fade8d51cec1e&head_oid=ef3a764f4df1cd1ff3cebf47cada078c21053f83
  useEffect(() => {
    // TODO (step 4+): kirim ke error tracking service kalau ada
    // (Sentry/dst). Untuk sekarang log ke console aja.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <SlafurryMark className="h-16 w-16 text-neutral-300 dark:text-neutral-700" />

      <p className="mt-6 font-display text-7xl tracking-wide text-neutral-300 dark:text-neutral-700">
        500
      </p>
      <h1 className="mt-1 font-display text-3xl tracking-wide">
        Something broke behind the scenes
      </h1>

      <p className="mt-3 max-w-sm font-display text-xl text-neutral-500 dark:text-neutral-400">
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
