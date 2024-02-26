import { fi } from "@/assets/texts"

export type TranslationsObject = typeof fi
export type TranslationKey = keyof TranslationsObject
export type Translations = Record<TranslationKey, string>

export enum Locale {
  fi = "fi",
  en = "en",
}
