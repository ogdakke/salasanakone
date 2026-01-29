import { Language } from "@/models/translations"

const LANG_COOKIE_NAME = "lang"

/**
 * Detect language from URL path
 * /en/* -> English
 * /* -> Finnish
 */
export function detectLanguageFromUrl(): Language {
  const pathname = window.location.pathname
  if (pathname.startsWith("/en")) {
    return Language.en
  }
  return Language.fi
}

/**
 * Get the lang cookie value
 */
export function getLangCookie(): Language | null {
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === LANG_COOKIE_NAME) {
      if (value === Language.en || value === Language.fi) {
        return value as Language
      }
    }
  }
  return null
}

/**
 * Set the lang cookie (1 year expiry)
 */
export function setLangCookie(lang: Language): void {
  const oneYear = 365 * 24 * 60 * 60
  document.cookie = `${LANG_COOKIE_NAME}=${lang}; path=/; max-age=${oneYear}; SameSite=Lax`
}

/**
 * Get the correct URL path for a language
 */
export function getLanguagePath(lang: Language): string {
  const currentPath = window.location.pathname

  if (lang === Language.en) {
    // Going to English
    if (currentPath.startsWith("/en")) {
      return currentPath // Already on English path
    }
    return `/en${currentPath === "/" ? "" : currentPath}`
  }

  // Going to Finnish
  if (currentPath.startsWith("/en")) {
    const finnishPath = currentPath.replace(/^\/en\/?/, "/")
    return finnishPath || "/"
  }
  return currentPath // Already on Finnish path
}

/**
 * Redirect to the correct language path
 */
export function redirectToLanguage(lang: Language): void {
  const targetPath = getLanguagePath(lang)
  const currentPath = window.location.pathname

  if (targetPath !== currentPath) {
    window.location.href = targetPath
  }
}
