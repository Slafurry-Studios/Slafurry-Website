"use client";

import { SkeletonImage, SkeletonText } from "@/components/ui/Skeleton";
import Link from "next/link";

export default function AdminLoading() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md space-y-8">
        <h1 className="font-display text-4xl tracking-wide text-neutral-900 dark:text-neutral-100 animate-pulse">
          Loading
        </h1>
        <div className="space-y-4">
          <SkeletonImage className="w-64 h-36 mx-auto" />
          <SkeletonText lines={4} />
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 animate-pulse">
          Loading admin data…
        </p>
      </div>
    </main>
  );
}
