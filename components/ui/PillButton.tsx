import { type ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type PillButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "outline" | "solid";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

// Tombol pill outline yang muncul berulang di seluruh desain: "Play Our
// Games", "Itch.io", "Say Hello", dst. variant="solid" dipakai buat CTA
// utama di atas background gelap (Hero).
export function PillButton({
  children,
  href,
  onClick,
  variant = "outline",
  icon,
  iconPosition = "left",
  className = "",
  type = "button",
}: PillButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-2.5 font-body text-sm font-medium transition-colors min-h-11";
  const style =
    variant === "solid"
      ? "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      : "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-neutral-900";

  const content =
    iconPosition === "right" ? (
      <>
        {children}
        {icon}
      </>
    ) : (
      <>
        {icon}
        {children}
      </>
    );

  if (href) {
    return (
      <Link href={href} className={`${base} ${style} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${base} ${style} ${className}`}>
      {content}
    </button>
  );
}
