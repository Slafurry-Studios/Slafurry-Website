import {
  getAchievements,
  isAchievementUnlocked,
} from "./engine";
import {
  getUnlockedKeys,
  getUnseenKeys,
  getVisitCount,
  getEventCounts,
  unlock,
  unlockMany,
  forceUnlock,
  markSeen,
  markAllSeen,
  incrementVisitCount,
  incrementEventCount,
  hydrate,
} from "./storage";
import { pushAchievementToast } from "@/components/achievements/AchievementToast";

type AchievementDebugAPI = {
  getUnlocked: () => string[];
  getUnseen: () => string[];
  getVisitCount: () => number;
  getEventCounts: () => Record<string, number>;
  getAll: () => ReturnType<typeof getAchievements>;
  isUnlocked: (key: string) => boolean;
  unlock: (key: string) => boolean;
  unlockMany: (keys: string[]) => string[];
  forceUnlock: (key: string) => void;
  markSeen: (key: string) => void;
  markAllSeen: () => void;
  incrementVisitCount: () => number;
  incrementEventCount: (name: string) => number;
  hydrate: () => ReturnType<typeof hydrate>;
  toast: (entry: { key: string; title: string; description: string; icon: string }) => void;
};

declare global {
  interface Window {
    __achievements?: AchievementDebugAPI;
  }
}

export function initDebugAPI(): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "development") return;

  const unlocked = getUnlockedKeys();

  window.__achievements = {
    getUnlocked: () => Array.from(getUnlockedKeys()),
    getUnseen: () => Array.from(getUnseenKeys()),
    getVisitCount,
    getEventCounts,
    getAll: getAchievements,
    isUnlocked: (key) => isAchievementUnlocked(key, unlocked),
    unlock,
    unlockMany,
    forceUnlock,
    markSeen,
    markAllSeen,
    incrementVisitCount,
    incrementEventCount,
    hydrate,
    toast: pushAchievementToast,
  };

  console.log(
    "%c🏆 Achievement debug API ready on window.__achievements",
    "color: #facc15; font-weight: bold"
  );
  console.log("Methods:", Object.keys(window.__achievements).join(", "));
}
