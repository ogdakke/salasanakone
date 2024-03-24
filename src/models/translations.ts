import type { fi } from "@/assets/texts"

type TranslationsObject = typeof fi
export type TranslationKey = keyof TranslationsObject
export type Translations = Record<TranslationKey, string>

export enum Language {
  fi = "fi",
  en = "en",
}
