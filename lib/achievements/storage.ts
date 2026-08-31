import { computeSignature, verifySignature } from "./integrity";

const STORAGE_KEY = "slafurry_achievements";
const CHEAT_ACHIEVEMENT_KEY = "cheating";

// ---------------------------------------------------------------------------
// Persisted shape stored in localStorage
// ---------------------------------------------------------------------------

export type AchievementStorageData = {
  unlockedKeys: string[];
  unseenKeys: string[];
  visitCount: number;
  eventCounts: Record<string, number>;
  signature: string;
};

// ---------------------------------------------------------------------------
// In-memory state (module-level singleton, hydrated from localStorage)
// ---------------------------------------------------------------------------

type AchievementState = {
  unlockedKeys: Set<string>;
  unseenKeys: Set<string>;
  visitCount: number;
  eventCounts: Record<string, number>;
};

let state: AchievementState = {
  unlockedKeys: new Set(),
  unseenKeys: new Set(),
  visitCount: 0,
  eventCounts: {},
};

let hydrated = false;

// ---------------------------------------------------------------------------
// Subscription — lets React components re-render on state changes
// ---------------------------------------------------------------------------

type StorageListener = () => void;
let storageListeners: StorageListener[] = [];

function notifyListeners(): void {
  for (const fn of storageListeners) fn();
}

export function subscribeStorage(listener: StorageListener): () => void {
  storageListeners.push(listener);
  return () => {
    storageListeners = storageListeners.filter((fn) => fn !== listener);
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage`, e);
  }
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

function serialize(): AchievementStorageData {
  const payload = {
    unlockedKeys: Array.from(state.unlockedKeys),
    unseenKeys: Array.from(state.unseenKeys),
    visitCount: state.visitCount,
    eventCounts: state.eventCounts,
  };

  return { ...payload, signature: computeSignature(payload) };
}

function deserialize(raw: string): AchievementStorageData | null {
  try {
    return JSON.parse(raw) as AchievementStorageData;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Hydrate state from localStorage. Safe to call multiple times — only
 * reads from disk on the first invocation.
 *
 * On first visit (no stored data), returns clean defaults.
 * On signature mismatch (tampering detected), silently grants the
 * Cheating! achievement and returns the data as invalid so the caller
 * knows not to trust it.
 */
export function hydrate(): {
  data: AchievementStorageData | null;
  valid: boolean;
} {
  if (hydrated) {
    return { data: null, valid: true };
  }

  hydrated = true;

  const raw = safeGetItem(STORAGE_KEY);
  if (!raw) return { data: null, valid: true }; // first visit — nothing stored yet

  const data = deserialize(raw);
  if (!data) return { data: null, valid: false }; // corrupted JSON — start fresh

  const valid = verifySignature(data);

  if (valid) {
    state.unlockedKeys = new Set(data.unlockedKeys);
    state.unseenKeys = new Set(data.unseenKeys);
    state.visitCount = data.visitCount;
    state.eventCounts = data.eventCounts;
  } else {
    // Tampering detected — silently grant the Cheating! achievement.
    // We still load the user's data so the UI isn't broken, but we
    // stamp the achievement into the state and re-persist with a valid
    // signature.
    state.unlockedKeys = new Set(data.unlockedKeys);
    state.unseenKeys = new Set(data.unseenKeys);
    state.visitCount = data.visitCount;
    state.eventCounts = data.eventCounts;

    forceUnlock(CHEAT_ACHIEVEMENT_KEY);
  }

  return { data, valid };
}

/**
 * Flush current in-memory state to localStorage (with a fresh signature).
 */
export function persist(): void {
  const payload = serialize();
  safeSetItem(STORAGE_KEY, JSON.stringify(payload));
  notifyListeners();
}

// ---------------------------------------------------------------------------
// State accessors
// ---------------------------------------------------------------------------

export function getUnlockedKeys(): Set<string> {
  return state.unlockedKeys;
}

export function getUnseenKeys(): Set<string> {
  return state.unseenKeys;
}

export function getVisitCount(): number {
  return state.visitCount;
}

export function getEventCounts(): Record<string, number> {
  return state.eventCounts;
}

// ---------------------------------------------------------------------------
// State mutators (each persists immediately)
// ---------------------------------------------------------------------------

export function unlock(key: string): boolean {
  if (state.unlockedKeys.has(key)) return false;
  state.unlockedKeys.add(key);
  state.unseenKeys.add(key);
  persist();
  return true;
}

export function unlockMany(keys: string[]): string[] {
  const newlyUnlocked: string[] = [];
  for (const key of keys) {
    if (!state.unlockedKeys.has(key)) {
      state.unlockedKeys.add(key);
      state.unseenKeys.add(key);
      newlyUnlocked.push(key);
    }
  }
  if (newlyUnlocked.length > 0) persist();
  return newlyUnlocked;
}

export function markSeen(key: string): void {
  state.unseenKeys.delete(key);
  persist();
}

export function markAllSeen(): void {
  state.unseenKeys.clear();
  persist();
}

export function incrementVisitCount(): number {
  state.visitCount += 1;
  persist();
  return state.visitCount;
}

export function incrementEventCount(eventName: string): number {
  state.eventCounts[eventName] = (state.eventCounts[eventName] ?? 0) + 1;
  persist();
  return state.eventCounts[eventName];
}

/**
 * Force-set the entire state (used when integrity check fails and we
 * need to grant the Cheating! achievement without going through the
 * normal event flow).
 */
export function forceUnlock(key: string): void {
  state.unlockedKeys.add(key);
  state.unseenKeys.add(key);
  persist();
}
