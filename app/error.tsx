"use client";

import { useEffect } from "react";

// Safety net paling luar — nangkep error yang kejadian DI DALAM
// app/[locale]/layout.tsx sendiri (termasuk kalau NextIntlClientProvider
// gagal render). Karena ini lapisan terakhir sebelum Next.js nampilin
// error page generic bawaan mereka, sengaja dibikin sesederhana dan
// se-independen mungkin: no next-intl, no custom component, no Tailwind
// theme variable yang mungkin belum sempat ke-load.
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem 1.5rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <p style={{ fontSize: "3rem", fontWeight: 700, margin: 0 }}>500</p>
      <h1 style={{ fontSize: "1.25rem", marginTop: "0.5rem" }}>
        Something went wrong
      </h1>
      <p style={{ marginTop: "0.5rem", color: "#666", maxWidth: 360 }}>
        The page failed to load. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: "1.5rem",
          padding: "0.6rem 1.5rem",
          borderRadius: 999,
          border: "1px solid #111",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
