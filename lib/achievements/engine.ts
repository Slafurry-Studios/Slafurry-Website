import { AchievementTrigger } from "@prisma/client";

export type { AchievementTrigger };

// ---------------------------------------------------------------------------
// Trigger-config shapes (mirror the Prisma AchievementTrigger enum)
// ---------------------------------------------------------------------------

type PageVisitConfig = { path: string };
type EventConfig = { eventName: string };
type VisitCountConfig = { count: number };
type ScrollDepthConfig = { path: string; percent: number };
type TimeOnSiteConfig = { seconds: number };
type MetaAllConfig = { [key: string]: unknown }; // placeholder — no runtime config needed

// Union of all client-side usable trigger configs
type TriggerConfig =
  | { kind: "page_visit"; config: PageVisitConfig }
  | { kind: "custom_event"; config: EventConfig }
  | { kind: "visit_count"; config: VisitCountConfig }
  | { kind: "scroll_depth"; config: ScrollDepthConfig }
  | { kind: "time_on_site"; config: TimeOnSiteConfig }
  | { kind: "meta_all"; config: MetaAllConfig };

// ---------------------------------------------------------------------------
// Achievement record (client-side relevant fields only)
// ---------------------------------------------------------------------------

type Achievement = {
  key: string;
  title: string;
  description: string;
  icon: string;
  triggerType: AchievementTrigger;
  triggerConfig: TriggerConfig["config"];
  isActive: boolean;
  isSecret: boolean;
  category?: string;
  order: number;
};

// ---------------------------------------------------------------------------
// Events the engine can dispatch and match against
// ---------------------------------------------------------------------------

type AchievementEvent =
  | { type: "page_visit"; path: string }
  | { type: "custom_event"; eventName: string }
  | { type: "scroll_depth"; path: string; percent: number }
  | { type: "time_on_site"; seconds: number }
  | { type: "visit_count"; count: number };

// ---------------------------------------------------------------------------
// Result of checking an event against cached achievements
// ---------------------------------------------------------------------------

type AchievementCheckResult = {
  triggered: Achievement[]; // achievements matched by this event (may be empty)
  allOthersUnlocked: boolean; // true if every non-secret, active achievement is unlocked
};

// ---------------------------------------------------------------------------
// Engine state (module-level cache, initialized once)
// ---------------------------------------------------------------------------

type EngineState = {
  achievements: Achievement[];
  initialized: boolean;
};

// Private module state — persisted across render cycles
let state: EngineState = {
  achievements: [],
  initialized: false,
};

// ---------------------------------------------------------------------------
// Public: initialize the engine with achievements data (fetched once, cached)
// ---------------------------------------------------------------------------

export function initialize(achievements: Achievement[]): void {
  if (!state.initialized) {
    // Filter to only active, non‑secret achievements for the working set;
    // secret / CHEAT_DETECTED achievements are left in the full list for
    // completeness but excluded from automatic triggering.
    state = {
      achievements,
      initialized: true,
    };
  }
}

// ---------------------------------------------------------------------------
// Public: get the full cached achievement list
// ---------------------------------------------------------------------------

export function getAchievements(): Achievement[] {
  return state.achievements;
}

// ---------------------------------------------------------------------------
// Public: check whether an achievement key is currently unlocked.
// The app must maintain its own unlock bitmap; this helper consults it if
// available, otherwise returns false (the engine only handles event matching).
// ---------------------------------------------------------------------------

export function isAchievementUnlocked(key: string, unlockedKeys: Set<string>): boolean {
  if (!unlockedKeys.has(key)) return false;

  const achievement = state.achievements.find((a) => a.key === key);
  if (!achievement || !achievement.isActive) return false;
  if (achievement.isSecret) return false; // secret achievements require manual flagging
  return true;
}

// ---------------------------------------------------------------------------
// Public: dispatch an event and return which achievements are triggered.
// The app should feed `unlockedKeys` (from localStorage or similar) into
// `isAchievementUnlocked` after this call.
// ---------------------------------------------------------------------------

export function checkEvent(event: AchievementEvent, unlockedKeys: Set<string> = new Set()): AchievementCheckResult {
  const triggered: Achievement[] = [];

  for (const achievement of state.achievements) {
    if (!achievement.isActive) continue;
    if (achievement.isSecret) continue; // skip secret — handled manually

    if (checkTrigger(achievement, event)) {
      triggered.push(achievement);
    }
  }

  // Determine if every non‑secret, active achievement is unlocked.
  // An achievement is considered "unlocked" if its key appears in unlockedKeys.
  const allOthersUnlocked = state.achievements.every((a) => {
    if (!a.isActive || a.isSecret) return true; // skip non‑eligible
    return unlockedKeys.has(a.key);
  });

  return { triggered, allOthersUnlocked };
}

// ---------------------------------------------------------------------------
// Core: match a single achievement against an event
// ---------------------------------------------------------------------------

function checkTrigger(achievement: Achievement, event: AchievementEvent): boolean {
  const config = achievement.triggerConfig;

  switch (achievement.triggerType) {
    case AchievementTrigger.PAGE_VISIT: {
      const pageVisitConfig = config as PageVisitConfig;
      return event.type === "page_visit" && event.path === pageVisitConfig.path;
    }

    case AchievementTrigger.EVENT: {
      const eventConfig = config as EventConfig;
      return event.type === "custom_event" && event.eventName === eventConfig.eventName;
    }

    case AchievementTrigger.VISIT_COUNT: {
      // visit_count is handled by the app tracking visit count externally;
      // the engine just validates the event type matches.
      return event.type === "visit_count";
    }

    case AchievementTrigger.SCROLL_DEPTH: {
      const scrollConfig = config as ScrollDepthConfig;
      return (
        event.type === "scroll_depth" &&
        event.path === scrollConfig.path &&
        event.percent >= scrollConfig.percent
      );
    }

    case AchievementTrigger.TIME_ON_SITE: {
      const timeConfig = config as TimeOnSiteConfig;
      return event.type === "time_on_site" && event.seconds >= timeConfig.seconds;
    }

    case AchievementTrigger.META_ALL: {
      // META_ALL is evaluated by the caller using `allOthersUnlocked` from
      // the returned result; the engine does not self‑resolve this trigger.
      return false;
    }

    default:
      return false;
  }
}