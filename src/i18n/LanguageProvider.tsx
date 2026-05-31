"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, type Locale } from "./dictionaries";

const STORAGE_KEY = "triplit_lang";

type Vars = Record<string, string | number>;

interface LanguageContextType {
  lang: Locale;
  setLang: (lang: Locale) => void;
  toggleLang: () => void;
  /** Translate a dot-path key, e.g. t("expenses.record"). Supports {var} interpolation. */
  t: (key: string, vars?: Vars) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function resolve(dict: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const candidates = [navigator.language, ...(navigator.languages || [])];
  return candidates.some((l) => l?.toLowerCase().startsWith("th")) ? "th" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start at "en" on the server and during hydration so the markup
  // matches; the stored/detected locale is applied in the effect below.
  const [lang, setLangState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    const next = stored === "en" || stored === "th" ? stored : detectBrowserLocale();
    if (next !== lang) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(next);
    }
    document.documentElement.lang = next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (next: Locale) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  };

  const toggleLang = () => setLang(lang === "en" ? "th" : "en");

  const t = (key: string, vars?: Vars): string => {
    const value = resolve(dictionaries[lang], key);
    if (typeof value === "string") return interpolate(value, vars);
    // Fall back to English, then to the raw key so missing strings are visible.
    const fallback = resolve(dictionaries.en, key);
    if (typeof fallback === "string") return interpolate(fallback, vars);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
