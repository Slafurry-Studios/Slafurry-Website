import { notFound } from "next/navigation";
import { followStoredRedirect } from "@/lib/queries/redirects";

// Path yang halamannya tidak ada akan ditangani oleh
// app/global-not-found.tsx (globalNotFound diaktifkan di next.config.ts).
// Sebelum 404, cek tabel Redirect (dulu dilakukan di proxy.ts).
export default async function CatchAll({
  params,
}: {
  params: Promise<{ rest: string[] }>;
}) {
  const { rest } = await params;
  await followStoredRedirect(`/${rest.join("/")}`);
  notFound();
}
