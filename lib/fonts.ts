import { Geist, Geist_Pixel, Pixelify_Sans } from "next/font/google";

// Pixelify Sans — primary display font (hero, section headings, game titles,
// large statistics, decorative numbers).
export const fontDisplay = Pixelify_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

// Geist Pixel — secondary pixel-inspired UI font (nav, buttons, badges,
// metadata, breadcrumbs, small UI labels).
export const fontUI = Geist_Pixel({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ui-family",
  display: "swap",
});

// Geist Sans — supporting body font (paragraphs, articles, descriptions,
// forms, long-form reading).
export const fontBody = Geist({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body-family",
  display: "swap",
});
