"use client";

import { FiGlobe } from "react-icons/fi";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function LanguageToggle() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      aria-label={t("lang.switchTo")}
      title={t("lang.switchTo")}
      className="relative flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-pearl-border dark:border-obsidian-border bg-pearl-card dark:bg-obsidian-card hover:bg-pearl-surface dark:hover:bg-obsidian-elevated hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer focus:outline-none"
    >
      <FiGlobe className="w-4 h-4 text-gold" />
      <span className="text-[11px] font-bold text-slate-700 dark:text-stone-200 tracking-wide">
        {lang === "en" ? t("lang.en") : t("lang.th")}
      </span>
    </button>
  );
}
