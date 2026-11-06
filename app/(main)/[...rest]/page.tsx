import { notFound } from "next/navigation";

// Path yang halamannya tidak ada akan ditangani oleh
// app/global-not-found.tsx (globalNotFound diaktifkan di next.config.ts).
// File ini memastikan notFound() dipanggil untuk route tangkapan semua.
export default function CatchAll() {
  notFound();
}
