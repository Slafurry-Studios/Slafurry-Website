"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type SeriousMode = "off" | "on";
type SoundMode = "off" | "on";

type SettingsContextValue = {
  seriousMode: SeriousMode;
  setSeriousMode: (mode: SeriousMode) => void;
  soundMuted: SoundMode;
  setSoundMuted: (mode: SoundMode) => void;
  serious: boolean;
  setSerious: (v: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}

function saveToLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`Failed to save setting ${key} to localStorage`, e);
  }
}

export function SettingsProvider({
  initialSeriousMode,
  initialSoundMuted,
  children,
}: {
  initialSeriousMode: SeriousMode;
  initialSoundMuted: SoundMode;
  children: ReactNode;
}) {
  // Dark mode dimatikan — light mode only.
  const [seriousMode, setSeriousMode] = useState<SeriousMode>(initialSeriousMode);
  const [soundMuted, setSoundMuted] = useState<SoundMode>(initialSoundMuted);
  const [serious, setSerious] = useState<boolean>(initialSeriousMode === "on");

  // Sync CSS classes on mount/change — class ".dark" selalu dilepas
  // (backup kalau user masih punya sisa state dark di localStorage).
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.toggle("serious", serious);
  }, [serious]);

  // Persist to localStorage on every change
  useEffect(() => {
    saveToLocalStorage("theme", "light");
    saveToLocalStorage("serious_mode", seriousMode ? "on" : "off");
    saveToLocalStorage("sound_muted", soundMuted ? "on" : "off");
  }, [seriousMode, soundMuted]);

  const updateSeriousMode = (mode: SeriousMode) => {
    setSeriousMode(mode);
    setSerious(mode === "on");
    saveToLocalStorage("serious_mode", mode);
  };

  const updateSoundMuted = (mode: SoundMode) => {
    setSoundMuted(mode);
    saveToLocalStorage("sound_muted", mode);
  };

  return (
    <SettingsContext.Provider
      value={{
        seriousMode,
        setSeriousMode: updateSeriousMode,
        soundMuted,
        setSoundMuted: updateSoundMuted,
        serious,
        setSerious,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
