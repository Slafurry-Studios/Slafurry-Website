"use client";

import { useState, useRef, useEffect } from "react";
import { IconSettings, IconSun } from "@tabler/icons-react";
import { useSettings } from "./SettingsContext";

// UI dropdown Settings — Sound Mute.
// Dark mode disabled (light mode only).
// State managed by SettingsContext shared across the whole app,
// so sound state stays consistent across components.
// Persistence to localStorage + cookie handled by SettingsProvider.
export function SettingsDropdown() {
    const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
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

  function toggleSound() {
    setSoundMuted(soundMuted === "on" ? "off" : "on");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Settings"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center pixel-border-sm text-neutral-900 transition-colors dark:text-white"
      >
        <IconSettings size={18} stroke={1.75} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
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
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-display text-xl font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      <span className={active ? "text-neutral-900 dark:text-white" : "text-neutral-400"}>
        {icon}
      </span>
      {label}
    </button>
  );
}
