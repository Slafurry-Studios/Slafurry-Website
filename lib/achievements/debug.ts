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
  redeem: (code: string) => Promise<{ success: boolean; message: string }>;
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

    redeem: async (code: string) => {
      try {
        const res = await fetch("/api/achievements/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();

        if (data.success) {
          const isNew = unlock(data.achievement.key);
          pushAchievementToast({
            key: data.achievement.key,
            title: data.achievement.title,
            description: data.achievement.description,
            icon: data.achievement.icon,
          });
          return { success: true, message: `Unlocked: ${data.achievement.title}` };
        }
        return { success: false, message: data.error || "Invalid code." };
      } catch (e) {
        return { success: false, message: `Redeem failed: ${e}` };
      }
    },
  };

  console.log(
    "%c🏆 Achievement debug API ready on window.__achievements",
    "color: #facc15; font-weight: bold"
  );
  console.log("Methods:", Object.keys(window.__achievements).join(", "));
}
