import { notFound } from "next/navigation";

// Tanpa file ini, path yang locale-nya valid tapi halamannya gak ada
// (misal /en/asal-ngetik) gak akan otomatis manggil
// app/[locale]/not-found.tsx — Next.js butuh route yang eksplisit
// manggil notFound() buat kasus ini (rekomendasi resmi next-intl).
export default function CatchAll() {
  notFound();
}
