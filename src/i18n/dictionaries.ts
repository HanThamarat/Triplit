// Index that combines the per-language dictionaries. Add a new language by
// creating its file (mirroring ./en.ts) and registering it in the map below.

import { en, type Dictionary } from "./en";
import { th } from "./th";

export type Locale = "en" | "th";
export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { en, th };
