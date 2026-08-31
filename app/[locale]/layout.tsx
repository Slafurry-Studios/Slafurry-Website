import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";
import { bebasNeue, poppins } from "@/lib/fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SettingsProvider } from "@/components/layout/SettingsContext";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";
import { AchievementToastContainer } from "@/components/achievements/AchievementToast";
import { AchievementCTA } from "@/components/achievements/AchievementCTA";
import { AchievementInit } from "@/components/achievements/AchievementInit";
import "../globals.css";

export const metadata: Metadata = {
  title: "Slafurry Studios",
  description: "Indie game developers. The joke went too far. Now we are going professional.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  // Baca preference dari cookie di server SEBELUM render pertama,
  // biar gak ada flash dari default -> dark/serious pas hydrate.
  // Nilai ini nanti disinkronkan lagi ke localStorage oleh SettingsProvider (client).
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";
  const seriousModeRaw = cookieStore.get("serious_mode")?.value === "on";
  const soundMutedRaw = cookieStore.get("sound_muted")?.value === "on";

  const htmlClassNames = [
    bebasNeue.variable,
    poppins.variable,
    theme,
    seriousModeRaw ? "serious" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang={locale} className={htmlClassNames}>
      <body
        className="min-h-screen flex flex-col font-body bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50"
        data-sound-muted={soundMutedRaw}
      >
        <SettingsProvider
          initialTheme={theme}
          initialSeriousMode={seriousModeRaw ? "on" : "off"}
          initialSoundMuted={soundMutedRaw ? "on" : "off"}
        >
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            {/* pt-24 = ruang buat Navbar yang sekarang "fixed" (gak makan document flow).
                Hero.tsx nge-cancel ini pakai -mt-24 biar background-nya full-bleed dari
                y=0, sementara halaman lain (belum ada background khusus di atas) otomatis
                dapet clearance yang bener dari padding ini. */}
            <main className="flex-1 pt-24">{children}</main>
            <Footer />
            <AchievementToastContainer />
            <AchievementCTA />
            <AchievementInit />
<CookieConsentBanner />
          </NextIntlClientProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
