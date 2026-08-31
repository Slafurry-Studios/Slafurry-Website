"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { getAchievements } from "@/lib/achievements/engine";
import {
  getUnlockedKeys,
  getUnseenKeys,
  markAllSeen,
  subscribeStorage,
} from "@/lib/achievements/storage";
import type { Achievement } from "@/lib/achievements/engine";

// ---------------------------------------------------------------------------
// Grouping helpers
// ---------------------------------------------------------------------------

function groupByCategory(achievements: Achievement[]): Map<string, Achievement[]> {
  const groups = new Map<string, Achievement[]>();
  for (const a of achievements) {
    const cat = a.category ?? "Uncategorized";
    const list = groups.get(cat);
    if (list) {
      list.push(a);
    } else {
      groups.set(cat, [a]);
    }
  }
  // Sort each group by order
  for (const list of groups.values()) {
    list.sort((a, b) => a.order - b.order);
  }
  return groups;
}

// ---------------------------------------------------------------------------
// AchievementCTA — floating smiley button, bottom-left
// ---------------------------------------------------------------------------

export function AchievementCTA() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(() => getUnseenKeys().size);
  const ref = useRef<HTMLDivElement>(null);

  // Re-render when storage changes
  useEffect(() => {
    return subscribeStorage(() => {
      setUnseenCount(getUnseenKeys().size);
    });
  }, []);

  // Click-outside to close panel
  useEffect(() => {
    if (!panelOpen) return;

    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [panelOpen]);

  // Escape key to close panel
  useEffect(() => {
    if (!panelOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPanelOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  return (
    <div ref={ref} className="fixed bottom-6 left-6 z-40">
      {/* Panel */}
      <AnimatePresence>
        {panelOpen && <AchievementPanel onClose={() => setPanelOpen(false)} />}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        type="button"
        onClick={() => setPanelOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-xl transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        aria-label="Achievements"
        aria-expanded={panelOpen}
      >
        <SlafurryMark className="h-8 w-8" />

        {/* Unseen badge */}
        {unseenCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex min-w-[22px] items-center justify-center rounded-full bg-yellow-400 px-1.5 py-0.5 font-body text-[11px] font-bold text-neutral-900 shadow-md">
            {unseenCount > 99 ? "99+" : unseenCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AchievementPanel — slide-in from left, lists achievements by category
// ---------------------------------------------------------------------------

function AchievementPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations("achievements");
  const [unlockedKeys, setUnlockedKeys] = useState(() => getUnlockedKeys());
  const [unseenKeys, setUnseenKeys] = useState(() => getUnseenKeys());

  const achievements = useMemo(() => getAchievements(), []);
  const groups = useMemo(() => groupByCategory(achievements), [achievements]);

  // Subscribe to storage changes
  useEffect(() => {
    return subscribeStorage(() => {
      setUnlockedKeys(new Set(getUnlockedKeys()));
      setUnseenKeys(new Set(getUnseenKeys()));
    });
  }, []);

  // Mark all as seen when panel opens
  useEffect(() => {
    markAllSeen();
  }, []);

  const totalUnlocked = unlockedKeys.size;
  const totalAchievements = achievements.filter((a) => a.isActive).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -320 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -320 }}
      transition={{ type: "spring", damping: 30, stiffness: 350 }}
      className="absolute bottom-0 left-0 mb-4 w-[min(380px,calc(100vw-3rem))] max-h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-700">
        <div>
          <h2 className="font-heading text-xl leading-tight">{t("title")}</h2>
          <p className="font-body text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {totalUnlocked} / {totalAchievements}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Achievement list */}
      <div className="overflow-y-auto max-h-[calc(100vh-14rem)] p-4 space-y-5">
        {Array.from(groups.entries()).map(([category, items]) => (
          <section key={category}>
            <h3 className="font-body text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2.5 px-1">
              {category}
            </h3>
            <div className="space-y-2">
              {items.map((achievement) => {
                const unlocked = unlockedKeys.has(achievement.key);
                const isNew = unseenKeys.has(achievement.key);
                const hidden = achievement.isSecret && !unlocked;

                return (
                  <div
                    key={achievement.key}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      unlocked
                        ? "bg-neutral-50 dark:bg-neutral-800"
                        : "bg-neutral-100/60 dark:bg-neutral-800/40"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700 ${
                        !unlocked ? "grayscale" : ""
                      }`}
                    >
                      <img
                        src={hidden ? "" : achievement.icon}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      {hidden && (
                        <span className="absolute inset-0 flex items-center justify-center font-heading text-lg text-neutral-400 dark:text-neutral-500">
                          ?
                        </span>
                      )}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-body text-sm font-medium truncate ${
                            unlocked
                              ? "text-neutral-900 dark:text-white"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`}
                        >
                          {hidden ? t("secret") : achievement.title}
                        </p>
                        {isNew && (
                          <span className="shrink-0 rounded-full bg-yellow-400 px-1.5 py-0.5 font-body text-[10px] font-bold text-neutral-900">
                            {t("new")}
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                        {hidden ? t("secret") : achievement.description}
                      </p>
                    </div>

                    {/* Status indicator */}
                    <div className="shrink-0">
                      {unlocked ? (
                        <span className="text-green-500 dark:text-green-400 text-sm">
                          ✓
                        </span>
                      ) : (
                        <span className="text-neutral-300 dark:text-neutral-600 text-sm">
                          ○
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {achievements.length === 0 && (
          <p className="text-center font-body text-sm text-neutral-400 dark:text-neutral-500 py-8">
            No achievements loaded yet.
          </p>
        )}
      </div>
    </motion.div>
  );
}
