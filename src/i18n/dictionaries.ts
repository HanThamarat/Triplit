// Index that combines the per-language dictionaries. Add a new language by
// creating its file (mirroring ./en.ts) and registering it in the map below.

import { en, type Dictionary } from "./en";
import { th } from "./th";

export type Locale = "en" | "th";
export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { en, th };

export interface LocaleMeta {
  code: Locale;
  /** Name shown in its own language. */
  label: string;
  /** Flag emoji. Renders as letters on platforms without flag-emoji support. */
  flag: string;
}

// Drives the language switcher UI. Add a new entry here when adding a language.
export const LOCALES: LocaleMeta[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
];
