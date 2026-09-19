import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";
import { AchievementToastContainer } from "@/components/achievements/AchievementToast";
import { AchievementCTA } from "@/components/achievements/AchievementCTA";
import { AchievementInit } from "@/components/achievements/AchievementInit";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
    </>
  );
}
