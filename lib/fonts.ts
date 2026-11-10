import { Pixelify_Sans } from "next/font/google";


// Pixelify Sans — only font used site-wide (headings, UI, body).
export const fontDisplay = Pixelify_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

