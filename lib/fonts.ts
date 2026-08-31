import { Bebas_Neue, Poppins } from "next/font/google";

// Bebas Neue — dipakai di semua heading (h1-h3, judul card, judul section)
// Cuma punya 1 weight (400/regular), tapi karena karakternya udah bold/condensed
// secara desain, itu cukup buat semua level heading.
export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading-family",
  display: "swap",
});

// Poppins — dipakai di body text, label, button, form
export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body-family",
  display: "swap",
});
