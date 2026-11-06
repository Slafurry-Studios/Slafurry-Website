"use client";

import { useEffect } from "react";

import { fontDisplay, fontBody } from "@/lib/fonts";

// Safety net paling luar — nangkep error yang terjadi di dalam root layout
// sendiri. Karena ini lapisan terakhir sebelum Next.js menampilkan error
// page generik bawaan, sengaja dibikin sesederhana dan se-independen
// mungkin: no custom component. Font variabel diset langsung di elemen ini
// lewat next/font class agar tetap berjalan bahkan jika root layout gagal
// sebelum variabel tema terpasang di <html>.
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

  const bodyClasses = [fontBody.variable, "font-body"].join(" ");

  return (
    <div
      className={bodyClasses}
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem 1.5rem",
        margin: 0,
      }}
    >
      <p className="font-display" style={{ fontSize: "3rem", fontWeight: 700, margin: 0 }}>
        500
      </p>
      <h1 className="font-display" style={{ fontSize: "1.25rem", marginTop: "0.5rem" }}>
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
