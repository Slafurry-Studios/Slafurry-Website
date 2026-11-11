"use client";

import { useEffect, useState } from "react";

export function Skeleton({
  className = "",
  width = "100%",
  height = "1rem",
  rounded = "rounded-lg",
}: {
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`animate-pulse ${rounded} bg-neutral-200 dark:bg-neutral-800 ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? "60%" : "100%"}
          height="0.875rem"
          className="mb-2"
        />
      ))}
    </div>
  );
}

export function SkeletonImage({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800 overflow-hidden ${className}`}
      style={{ width: "100%", aspectRatio: "16/9" }}
      aria-hidden="true"
    >
      <div className="animate-pulse h-full w-full bg-neutral-300 dark:bg-neutral-700" />
    </div>
  );
}

// Hook to show a skeleton for a minimum duration (prevents flash)
export function useLoadingState(
  isLoading: boolean,
  minMs: number = 500,
): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
      const t = setTimeout(() => setShow(false), minMs);
      return () => clearTimeout(t);
    }
    setShow(false);
  }, [isLoading, minMs]);

  return show;
}
