import { Caveat, Delicious_Handrawn } from "next/font/google";

// Caveat — handdrawn, dipakai di semua heading (h1-h3, judul card, judul section).
// Variabel 400-700, jadi weight heading tetap bisa di-set.
export const caveat = Caveat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading-family",
  display: "swap",
});

// Delicious Handrawn — dipakai di body text, label, button, form.
// Handdrawn, cuma punya 1 weight (400).
export const deliciousHandrawn = Delicious_Handrawn({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body-family",
  display: "swap",
});
