import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { caveat, deliciousHandrawn } from "@/lib/fonts";
import { SettingsProvider } from "@/components/layout/SettingsContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slafurry Studios",
  description: "Indie game developers. The joke went too far. Now we are going professional.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // Baca preference dari cookie di server SEBELUM render pertama,
  // biar gak ada flash dari default -> serious pas hydrate.
  // Dark mode dimatikan (light mode only).
  // Nilai ini nanti disinkronkan lagi ke localStorage oleh SettingsProvider (client).
  const cookieStore = await cookies();
  const seriousModeRaw = cookieStore.get("serious_mode")?.value === "on";
  const soundMutedRaw = cookieStore.get("sound_muted")?.value === "on";

  const htmlClassNames = [
    caveat.variable,
    deliciousHandrawn.variable,
    seriousModeRaw ? "serious" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang="en" className={htmlClassNames}>
      <body
        className="min-h-screen flex flex-col font-body bg-white text-neutral-900"
        data-sound-muted={soundMutedRaw}
      >
        <SettingsProvider
          initialSeriousMode={seriousModeRaw ? "on" : "off"}
          initialSoundMuted={soundMutedRaw ? "on" : "off"}
        >
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
