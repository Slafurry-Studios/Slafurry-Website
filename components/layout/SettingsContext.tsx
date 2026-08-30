"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type ThemeMode = "light" | "dark";
type SeriousMode = "off" | "on";
type SoundMode = "off" | "on";

type SettingsContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  seriousMode: SeriousMode;
  setSeriousMode: (mode: SeriousMode) => void;
  soundMuted: SoundMode;
  setSoundMuted: (mode: SoundMode) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
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
  initialTheme,
  initialSeriousMode,
  initialSoundMuted,
  children,
}: {
  initialTheme: ThemeMode;
  initialSeriousMode: SeriousMode;
  initialSoundMuted: SoundMode;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [seriousMode, setSeriousMode] = useState<SeriousMode>(initialSeriousMode);
  const [soundMuted, setSoundMuted] = useState<SoundMode>(initialSoundMuted);
  const [dark, setDark] = useState<boolean>(initialTheme === "dark");
  const [serious, setSerious] = useState<boolean>(initialSeriousMode === "on");

  // Sync CSS classes on mount/change
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("serious", serious);
  }, [dark, serious]);

  // Persist to localStorage on every change
  useEffect(() => {
    saveToLocalStorage("theme", theme);
    saveToLocalStorage("serious_mode", seriousMode ? "on" : "off");
    saveToLocalStorage("sound_muted", soundMuted ? "on" : "off");
  }, [theme, seriousMode, soundMuted]);

  const updateTheme = (mode: ThemeMode) => {
    setTheme(mode);
    setDark(mode === "dark");
    saveToLocalStorage("theme", mode);
  };

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
        theme,
        setTheme: updateTheme,
        seriousMode,
        setSeriousMode: updateSeriousMode,
        soundMuted,
        setSoundMuted: updateSoundMuted,
        dark,
        setDark,
        serious,
        setSerious,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}