import { type ReactNode } from "react";
import Link from "next/link";

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
    "inline-flex items-center justify-center gap-6 pixel-border px-12 py-6 font-display text-3xl font-medium transition-all hover:scale-105 min-h-14";
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
