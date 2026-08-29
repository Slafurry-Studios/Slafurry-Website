"use client";

import { useState, useRef, useEffect } from "react";
import { IconSettings, IconSun, IconMoon } from "@tabler/icons-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

// UI dropdown Settings — Language, Light/Dark, Serious Mode. Untuk step 2
// ini interaksinya cuma toggle class lokal (biar keliatan hidup di demo);
// persistence beneran ke cookie/localStorage dipasang di step 5
// (SettingsProvider) sesuai spec.
export function SettingsDropdown() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [serious, setSerious] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    setDark((v) => !v);
    document.documentElement.classList.toggle("dark");
  }

  function toggleSerious() {
    setSerious((v) => !v);
    document.documentElement.classList.toggle("serious");
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
            icon={dark ? <IconMoon size={16} /> : <IconSun size={16} />}
            label={dark ? t("darkMode") : t("lightMode")}
            active={dark}
            onClick={toggleDark}
          />
          <SettingsRow
            icon={<span className="text-base leading-none">🙂</span>}
            label={`${t("seriousMode")} | ${serious ? t("on") : t("off")}`}
            active={serious}
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
