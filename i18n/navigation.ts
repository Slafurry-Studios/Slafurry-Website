import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrapper Link/useRouter/redirect yang otomatis nempelin locale prefix.
// Dipakai di komponen manapun yang butuh navigasi (Navbar, dst) —
// jangan pakai next/link atau next/navigation langsung.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
