// Konvensi Next.js 16 (experimental, diaktifkan via next.config.ts
// `experimental.globalNotFound`). Dipakai khusus karena root layout kita
// pakai top-level dynamic segment (app/[locale]/layout.tsx) — Next.js
// gak bisa nyusun 404 global dari kombinasi layout.js + not-found.js
// biasa buat kasus ini, jadi butuh file terpisah yang BYPASS semua layout.
//
// Konsekuensinya: file ini HARUS include <html>/<body> sendiri, gak bisa
// pakai NextIntlClientProvider (belum tentu ada locale yang ke-resolve),
// dan sebaiknya gak gantung ke next/font (biar tetep ringan & gak ikut
// gagal kalau font fetch bermasalah). Untuk kasus dalam-locale yang gak
// ketemu (misal /en/asal-ngetik), itu di-handle oleh
// app/[locale]/[...rest]/page.tsx yang manggil notFound() ke
// app/[locale]/not-found.tsx (localized, on-brand). File ini murni buat
// URL yang gak match apapun sama sekali.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 1.5rem",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
        }}
      >
        <p style={{ fontSize: "4rem", fontWeight: 700, margin: 0, color: "#ccc" }}>
          404
        </p>
        <h1 style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
          This page went unfinished too
        </h1>
        <p style={{ marginTop: "0.5rem", color: "#666", maxWidth: 360 }}>
          Looks like you&apos;re lost. Maybe this page got caught in a joke
          that went too far.
        </p>
        <a
          href="/"
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 1.5rem",
            borderRadius: 999,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Back to Home
        </a>
      </body>
    </html>
  );
}
