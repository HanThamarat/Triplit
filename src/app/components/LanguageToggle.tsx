"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { useLanguage } from "@/i18n/LanguageProvider";
import { LOCALES } from "@/i18n/dictionaries";

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === lang) ?? LOCALES[0];

  // Close on outside click or Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("lang.switchTo")}
        title={t("lang.switchTo")}
        className="flex items-center gap-1.5 px-2.5 py-[10px] rounded-xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:bg-pearl-surface dark:hover:bg-obsidian-elevated active:scale-95 transition-all duration-300 shadow-sm cursor-pointer focus:outline-none"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-bold text-slate-700 dark:text-stone-200 tracking-wide">
          {current.code.toUpperCase()}
        </span>
        <FiChevronDown
          className={`w-3 h-3 text-pearl-muted dark:text-obsidian-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("lang.label")}
          className="absolute right-0 mt-2 w-44 z-[60] rounded-xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card shadow-xl overflow-hidden py-1 animate-text-reveal"
        >
          {LOCALES.map((l) => {
            const selected = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-[10px] text-left cursor-pointer transition-colors ${
                  selected
                    ? "bg-blue-subtle dark:bg-gold/[0.06] text-blue-primary dark:text-gold"
                    : "text-slate-700 dark:text-stone-200 hover:bg-pearl-surface dark:hover:bg-obsidian-elevated"
                }`}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className="flex-1 text-xs font-semibold">{l.label}</span>
                {selected && <FiCheck className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
