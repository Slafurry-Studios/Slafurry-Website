import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { PillButton } from "@/components/ui/PillButton";

// Achievement flag-hunting hook (lihat spec: model Achievement, trigger
// FLAG_CODE) — halaman ini dipilih jadi salah satu tempat sembunyi flag.
// Code seed: slafury-flag-2024
// Hash: sha256("slafury-flag-2024") = 258f2a81a07cdd569249d1606f9da76de201f74b0b6f707bbb37f730bcd439f1
// Diverifikasi server-side lewat /api/achievements/redeem.
// pengguna yang berhasil meredeem achievement ini akan mendapatkan
// achievement "Flag Hunter" dan toast notifikasi.
const FLAG_HINT_COMMENT = {
  __html:
    "<p><strong>Flag code:</strong> <code>slafury-flag-2024</code></p>" +
    "<p><strong>How to redeem:</strong> Masukkan kode di panel Achievement (AchievementCTA → tab Redeem) " +
    "atau melalui <code>/api/achievements/redeem</code> POST dengan body <code>{ code: \"slafury-flag-2024\" }</code>." +
    "<p>Jika berhasil, akan mendapatkan achievement <em>Flag Hunter</em> dan notifikasi toast.</p>",
};

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <span aria-hidden="true" dangerouslySetInnerHTML={FLAG_HINT_COMMENT} />
      <SlafurryMark className="h-16 w-16 text-neutral-300 dark:text-neutral-700" />

      <p className="mt-6 font-heading text-7xl tracking-wide text-neutral-300 dark:text-neutral-700">
        {t("title")}
      </p>
      <h1 className="mt-1 font-heading text-3xl tracking-wide">{t("heading")}</h1>

      <p className="joke-only mt-3 max-w-sm font-body text-sm text-neutral-500 dark:text-neutral-400">
        {t("body")}
      </p>
      <p className="serious-only mt-3 max-w-sm font-body text-sm text-neutral-500 dark:text-neutral-400">
        {t("bodySerious")}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <PillButton href="/" variant="solid">
          {t("backHome")}
        </PillButton>
        <PillButton href="/games">{t("viewGames")}</PillButton>
      </div>
    </div>
  );
}
