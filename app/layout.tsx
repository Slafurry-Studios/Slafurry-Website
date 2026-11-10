import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fontDisplay } from "@/lib/fonts";
import { SettingsProvider } from "@/components/layout/SettingsContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slafurry Studios",
  description: "Indie game developers. The joke went too far. Now we are going professional.",
  icons: {
    icon: "/slafurry-logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // Serious Mode + sound mute dihapus — cookie lama udah gak dibaca,
  // class "serious" gak pernah dipasang lagi.
  const htmlClassNames = [
    fontDisplay.variable,
  ].join(" ");

  return (
    <html lang="en" className={htmlClassNames}>
      <body className="min-h-screen flex flex-col font-display bg-white text-neutral-900">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
