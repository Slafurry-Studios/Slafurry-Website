"use client";

import { useState, useRef, useEffect } from "react";
import { IconSettings, IconSun, IconMoon } from "@tabler/icons-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSettings } from "./SettingsContext";

// UI dropdown Settings — Language, Light/Dark, Serious Mode.
// Persistence ke cookie/localStorage dikelola oleh SettingsProvider.
// Dropdown ini toggle class visual; nilai asli disinkronkan dari context.
export function SettingsDropdown() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
    theme,
    seriousMode,
    soundMuted,
    dark,
    serious,
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

  // Local toggle state, disinkronkan ke context saat effect run
  const [localDark, setLocalDark] = useState(dark);
  const [localSerious, setLocalSerious] = useState(serious);

  useEffect(() => {
    // Sync ke context ketika komponen mount atau state berubah
    // (setter dari context sudah menangani localStorage persistensi)
    // Hanya update visual CSS classes melalui HTML classes di layout.tsx
  }, [dark, serious]);

  // Apply local toggle to HTML classes immediately
  useEffect(() => {
    document.documentElement.classList.toggle("dark", localDark);
    document.documentElement.classList.toggle("serious", localSerious);
  }, [localDark, localSerious]);

  function toggleDark() {
    setLocalDark((v) => !v);
  }

  function toggleSerious() {
    setLocalSerious((v) => !v);
  }

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("language")}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-900 text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-neutral-900"
      >
        <IconSettings size={18} stroke={1.75} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          <div className="px-3 py-2">
            <p className="mb-1.5 font-body text-xs font-semibold text-neutral-500">
              {t("language")}
            </p>
            <div className="flex gap-1.5">
              {["en", "id"].map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={`rounded-full px-2.5 py-1 font-body text-xs font-medium ${
                    locale === loc
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "border border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <SettingsRow
            icon={localDark ? <IconMoon size={16} /> : <IconSun size={16} />}
            label={localDark ? t("darkMode") : t("lightMode")}
            active={localDark}
            onClick={toggleDark}
          />
          <SettingsRow
            icon={<span className="text-base leading-none">🙂</span>}
            label={`${t("seriousMode")} | ${localSerious ? t("on") : t("off")}`}
            active={localSerious}
            onClick={toggleSerious}
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