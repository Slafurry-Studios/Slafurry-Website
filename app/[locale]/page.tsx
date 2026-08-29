import { useTranslations } from "next-intl";

// Placeholder — halaman Home asli (hero video montage, about, carousel, dst)
// dibangun di step 2 roadmap. File ini cuma buat konfirmasi setup (font,
// i18n, tailwind) udah nyambung bener sebelum lanjut ke komponen beneran.
export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-body text-sm uppercase tracking-widest text-neutral-500">
        {t("eyebrow")}
      </p>
      <h1 className="font-heading text-6xl tracking-wide">Slafurry Studios</h1>
      <p className="max-w-md text-sm text-neutral-500">
        Setup checkpoint: Next.js + Tailwind + next-intl + Bebas Neue/Poppins
        udah nyambung. Halaman ini akan diganti komponen Home asli di step
        berikutnya.
      </p>
    </main>
  );
}
