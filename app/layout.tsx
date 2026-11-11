import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fontDisplay } from "@/lib/fonts";
import { SettingsProvider } from "@/components/layout/SettingsContext";
import ToastProviderWrapper from "@/components/ui/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slafurry Studios",
  description: "Indie game developers. The joke went too far. Now we are going professional.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

// Serious Mode removed — cookie lama udah gak dibaca,
// class "serious" gak pernah dipasang lagi.
  const htmlClassNames = [
    fontDisplay.variable,
  ].join(" ");

  return (
    <html lang="en" className={htmlClassNames}>
      <body className="min-h-screen flex flex-col font-display bg-white text-neutral-900">
        <SettingsProvider>{children}</SettingsProvider>
        <ToastProviderWrapper>{children}</ToastProviderWrapper>
      </body>
    </html>
  );
}
