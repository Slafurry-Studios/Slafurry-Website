"use client";

import { useState, useRef, useEffect } from "react";
import { IconSettings, IconSun, IconMoon } from "@tabler/icons-react";
import { useSettings } from "./SettingsContext";

// UI dropdown Settings — Light/Dark, Serious Mode, Sound Mute.
// State dikelola oleh SettingsContext yang shared di seluruh app,
// sehingga theme/serious/sound state konsisten seluruh komponen.
// Persistence ke localStorage + cookie handled oleh SettingsProvider.
export function SettingsDropdown() {
    const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
    dark,
    setDark,
    serious,
    setSerious,
    soundMuted,
    setSoundMuted,
  } = useSettings();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggleDark() {
    setDark(!dark);
  }

  function toggleSerious() {
    setSerious(!serious);
  }

  function toggleSound() {
    setSoundMuted(soundMuted === "on" ? "off" : "on");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Language"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-900 text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-neutral-900"
      >
        <IconSettings size={18} stroke={1.75} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          <SettingsRow
            icon={dark ? <IconMoon size={16} /> : <IconSun size={16} />}
            label={dark ? "Dark Mode" : "Light Mode"}
            active={dark}
            onClick={toggleDark}
          />
          <SettingsRow
            icon={<span className="text-base leading-none">🙂</span>}
            label={`$"Serious Mode" | ${serious ? "ON" : "OFF"}`}
            active={serious}
            onClick={toggleSerious}
          />
          <SettingsRow
            icon={soundMuted ? <IconSun size={16} /> : <IconSettings size={16} />}
            label={soundMuted ? "Unmute" : "Mute Sound"}
            active={soundMuted === "on"}
            onClick={toggleSound}
          />
        </div>
      )}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-body text-sm font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      <span className={active ? "text-neutral-900 dark:text-white" : "text-neutral-400"}>
        {icon}
      </span>
      {label}
    </button>
  );
}