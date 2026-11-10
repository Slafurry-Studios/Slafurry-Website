import { type ReactNode } from "react";
import Link from "next/link";

type PillButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "outline" | "solid";
  size?: "default" | "sm";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function PillButton({
  children,
  href,
  onClick,
  variant = "outline",
  size = "default",
  icon,
  iconPosition = "left",
  className = "",
  type = "button",
}: PillButtonProps) {
  const base =
    size === "sm"
      ? "inline-flex items-center justify-center gap-2 pixel-border px-4 py-2 font-display text-lg font-medium transition-all hover:scale-105 min-h-10 sm:gap-4 sm:px-6 sm:py-3 sm:text-xl"
      : "inline-flex items-center justify-center gap-3 pixel-border px-6 py-4 font-display text-base font-medium transition-all hover:scale-105 min-h-14 sm:gap-6 sm:px-12 sm:py-6 sm:text-xl md:text-3xl";
  const style =
    variant === "solid"
      ? "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      : "text-neutral-900 dark:text-white";

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
