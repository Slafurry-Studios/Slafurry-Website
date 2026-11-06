// Konvensi Next.js 16 (experimental, diaktifkan via next.config.ts
// `experimental.globalNotFound`). File ini BYPASS semua layout dan wajib
// include <html>/<body> sendiri, biar ringan dan tidak ikut gagal jika
// pemuatan font bermasalah. Digunakan untuk URL yang tidak cocok dengan
// route apapun.
import type { Metadata } from "next";

import { fontDisplay, fontUI, fontBody } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  const htmlClasses = [fontDisplay.variable, fontUI.variable, fontBody.variable].join(" ");

  return (
    <html lang="en" className={htmlClasses}>
      <body
        className="font-body"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 1.5rem",
          margin: 0,
        }}
      >
        <p
          className="font-display"
          style={{ fontSize: "4rem", fontWeight: 700, margin: 0, color: "#ccc" }}
        >
          404
        </p>
        <h1 className="font-display" style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
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
