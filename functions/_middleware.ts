interface Env {}

type Context = {
  request: Request
  next: () => Promise<Response>
  env: Env
}

const LANG_COOKIE_NAME = "lang"
const SUPPORTED_LANGUAGES = ["fi", "en"] as const

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("Cookie")
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(";").map((c) => c.trim())
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=")
    if (cookieName === name) {
      return cookieValue
    }
  }
  return null
}

function getPreferredLanguage(request: Request): "fi" | "en" {
  const acceptLanguage = request.headers.get("Accept-Language")
  if (!acceptLanguage) return "fi"

  // Parse Accept-Language header and find the first supported language
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=")
      return {
        code: code.split("-")[0].toLowerCase(),
        q: qValue ? Number.parseFloat(qValue) : 1.0,
      }
    })
    .sort((a, b) => b.q - a.q)

  for (const lang of languages) {
    if (lang.code === "en") return "en"
    if (lang.code === "fi") return "fi"
  }

  return "fi" // Default to Finnish
}

function shouldSkipRedirect(pathname: string): boolean {
  // Skip redirect for assets, API routes, etc.
  const skipPatterns = [
    /^\/assets\//,
    /^\/api\//,
    /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|webp|webmanifest)$/,
    /^\/sw\.js/,
    /^\/workbox-/,
    /^\/registerSW\.js/,
  ]

  return skipPatterns.some((pattern) => pattern.test(pathname))
}

export const onRequest = async (context: Context): Promise<Response> => {
  const { request, next } = context
  const url = new URL(request.url)
  const pathname = url.pathname

  // Skip redirect for static assets
  if (shouldSkipRedirect(pathname)) {
    return next()
  }

  // Check for explicit language cookie - if present, respect user's choice
  const langCookie = getCookie(request, LANG_COOKIE_NAME)
  if (langCookie && SUPPORTED_LANGUAGES.includes(langCookie as "fi" | "en")) {
    return next()
  }

  // No cookie set - check Accept-Language header for auto-redirect
  const preferredLang = getPreferredLanguage(request)
  const isOnEnglishPath = pathname.startsWith("/en")
  const isOnFinnishPath = !isOnEnglishPath

  // Redirect based on Accept-Language if needed
  if (preferredLang === "en" && isOnFinnishPath) {
    // User prefers English but is on Finnish path -> redirect to /en
    const newUrl = new URL(url)
    newUrl.pathname = `/en${pathname === "/" ? "" : pathname}`
    return Response.redirect(newUrl.toString(), 302)
  }

  if (preferredLang === "fi" && isOnEnglishPath) {
    // User prefers Finnish but is on English path -> redirect to root
    const newUrl = new URL(url)
    newUrl.pathname = pathname.replace(/^\/en\/?/, "/") || "/"
    return Response.redirect(newUrl.toString(), 302)
  }

  return next()
}
