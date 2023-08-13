export type TranslationKey = string
export enum Locale {
  fi = "fi",
  en = "en",
}
export type Translations = {
  [key in Locale]: Record<string, string>
}
