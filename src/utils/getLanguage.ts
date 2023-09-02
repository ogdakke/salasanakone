import { appTranslations } from "../assets/texts"
import { Locale, TranslationKey } from "../models/translations"

// const currentLocale: Locale = Locale.fi // You can determine this dynamically based on user preference or browser setting
let currentLocale = Locale.fi

export function getLocale() {
  return currentLocale || Locale.fi
}

export function setLocale(locale: Locale) {
  if (locale === currentLocale) {
    return currentLocale
  }
  currentLocale = locale
  return currentLocale
}

export const t = (key: TranslationKey, placeholders?: Record<PropertyKey, string>): string => {
  const translation = appTranslations[currentLocale][key] || key

  if (!placeholders) {
    return translation
  }

  // Handle interpolation
  return Object.keys(placeholders).reduce((str, placeholderKey) => {
    const regex = new RegExp(`{${placeholderKey}}`, "g")
    return str.replace(regex, placeholders[placeholderKey])
  }, translation)
}
