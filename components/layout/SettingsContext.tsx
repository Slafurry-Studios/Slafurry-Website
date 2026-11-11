"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type SoundMode = "off" | "on";

type SettingsContextValue = {
  soundMuted: SoundMode;
  setSoundMuted: (mode: SoundMode) => void;
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
  children,
}: {
  children: ReactNode;
}) {
  const [soundMuted] = useState<SoundMode>("off");

  // Force light mode, class "dark"/"serious" removed permanently (backup
  // for users who still have leftover state in localStorage).
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("serious");
  }, []);

  useEffect(() => {
    saveToLocalStorage("theme", "light");
  }, []);

  const updateSoundMuted = (mode: SoundMode) => {
    void mode; // no-op
  };

  return (
    <SettingsContext.Provider
      value={{
        soundMuted,
        setSoundMuted: updateSoundMuted,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
