"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSettings } from "@/components/layout/SettingsContext";
import { playUnlockSound } from "@/lib/achievements/sound";
import { markSeen } from "@/lib/achievements/storage";

// ---------------------------------------------------------------------------
// Toast data shape
// ---------------------------------------------------------------------------

type ToastEntry = {
  key: string;
  title: string;
  description: string;
  icon: string;
};

// ---------------------------------------------------------------------------
// Module-level queue (persists across renders, same pattern as storage.ts)
// ---------------------------------------------------------------------------

let queue: ToastEntry[] = [];
let listeners: Array<() => void> = [];
let currentKey: string | null = null;

function emitChange() {
  for (const fn of listeners) fn();
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((fn) => fn !== listener);
  };
}

function getSnapshot(): { current: ToastEntry | null; queued: number } {
  return {
    current: currentKey ? queue.find((e) => e.key === currentKey) ?? null : null,
    queued: currentKey ? queue.filter((e) => e.key !== currentKey).length : queue.length,
  };
}

// ---------------------------------------------------------------------------
// Mobile detection (1 visible on mobile, 3 on desktop)
// ---------------------------------------------------------------------------

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 640px)").matches;
}

// ---------------------------------------------------------------------------
// Toast display duration
// ---------------------------------------------------------------------------

const TOAST_DURATION_MS = 4500;

// ---------------------------------------------------------------------------
// Public: push an achievement into the toast queue
// ---------------------------------------------------------------------------

export function pushAchievementToast(entry: ToastEntry): void {
  // Deduplicate — don't queue the same key twice
  if (queue.some((e) => e.key === entry.key)) return;

  queue = [...queue, entry];

  // If nothing is currently showing, start immediately
  if (!currentKey) {
    currentKey = entry.key;
  }

  emitChange();
}

// ---------------------------------------------------------------------------
// AchievementToast — single toast visual (Steam-style, bottom-right)
// ---------------------------------------------------------------------------

function AchievementToast({
  entry,
  onDismiss,
}: {
  entry: ToastEntry;
  onDismiss: () => void;
}) {
  const t = useTranslations("achievements");
  const { soundMuted } = useSettings();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    // Play unlock sound (respect mute setting)
    if (soundMuted === "off") {
      playUnlockSound();
    }

    timerRef.current = setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.key]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      className="flex items-center gap-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-2xl px-5 py-4 shadow-2xl border border-neutral-700 dark:border-neutral-300 w-[min(340px,calc(100vw-2rem))]"
    >
      {/* Achievement icon */}
      <div className="relative shrink-0">
        <img
          src={entry.icon}
          alt=""
          className="w-12 h-12 rounded-xl object-cover bg-neutral-800 dark:bg-neutral-200"
        />
        {/* Sparkle indicator */}
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-neutral-900">
            ★
          </span>
        </span>
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-body font-semibold uppercase tracking-wider text-yellow-400 dark:text-yellow-500 mb-0.5">
          {t("new")}
        </p>
        <p className="font-heading text-lg leading-tight truncate">
          {entry.title}
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 font-body mt-0.5">
          {t("unlocked")}
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          onDismiss();
        }}
        className="shrink-0 text-neutral-500 dark:text-neutral-400 hover:text-white dark:hover:text-neutral-900 transition-colors text-lg leading-none px-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// AchievementToastContainer — manages queue, renders active toast
// ---------------------------------------------------------------------------

export function AchievementToastContainer() {
  const [, forceUpdate] = useState(0);
  const { current, queued } = getSnapshot();
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Subscribe to queue changes
  useEffect(() => {
    return subscribe(() => forceUpdate((n) => n + 1));
  }, []);

  const handleDismiss = useCallback(() => {
    if (currentKey) {
      markSeen(currentKey);
    }

    // Find next in queue
    const remaining = queue.filter((e) => e.key !== currentKey);
    queue = remaining;
    currentKey = remaining.length > 0 ? remaining[0].key : null;

    emitChange();
  }, []);

  // If on mobile and there are queued items, defer extras
  const visible = current;
  const maxVisible = isMobile() ? 1 : 3;

  return (
    <div
      aria-live="polite"
      aria-label="Achievement notifications"
      className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {visible && (
          <div key={visible.key} className="pointer-events-auto">
            <AchievementToast entry={visible} onDismiss={handleDismiss} />
            {/* Queue indicator */}
            {queued > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-neutral-500 dark:text-neutral-400 font-body text-right mt-1.5 pr-1"
              >
                +{queued} more
              </motion.p>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
