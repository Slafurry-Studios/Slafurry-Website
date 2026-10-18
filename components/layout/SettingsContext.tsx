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

// Serious Mode + sound mute dihapus dari UI (settings button juga udah
// dicabut). Context shape dipertahanin biar komponen lama tetap compile —
// nilainya fixed "off", gak ada yang bisa ngubah.
export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [seriousMode] = useState<SeriousMode>("off");
  const [soundMuted] = useState<SoundMode>("off");
  const [serious] = useState<boolean>(false);

  // Force light mode, class "dark"/"serious" dilepas permanen (backup
  // buat user yang masih nyimpen sisa state lama di localStorage).
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("serious");
  }, []);

  useEffect(() => {
    saveToLocalStorage("theme", "light");
  }, []);

  const updateSeriousMode = (mode: SeriousMode) => {
    void mode; // fitur dimatikan — no-op
  };

  const updateSoundMuted = (mode: SoundMode) => {
    void mode; // fitur dimatikan — no-op
  };

  return (
    <SettingsContext.Provider
      value={{
        seriousMode,
        setSeriousMode: updateSeriousMode,
        soundMuted,
        setSoundMuted: updateSoundMuted,
        serious,
        setSerious: () => {}, // fitur dimatikan — no-op
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
