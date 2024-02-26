import { en, fi } from "@/assets/texts"
import { Locale, TranslationKey } from "@/models/translations"
import { Fragment } from "react"

// const currentLocale: Locale = Locale.fi
let currentLocale = Locale.fi

function getLocale() {
  return currentLocale || Locale.fi
}

function setLocale(locale: Locale) {
  if (locale === currentLocale) {
    return currentLocale
  }
  currentLocale = locale
  return currentLocale
}

const t = (
  key: TranslationKey,
  placeholders?: Record<PropertyKey, string>,
): (string | JSX.Element)[] => {
  let translation = currentLocale === Locale.fi ? fi[key] : en[key] || key

  if (placeholders) {
    // Handle interpolation
    translation = Object.keys(placeholders).reduce((str, placeholderKey) => {
      const regex = new RegExp(`{${placeholderKey}}`, "g")
      return str.replace(regex, placeholders[placeholderKey])
    }, translation)
  }

  const translatedWithLineBreaks = translation.split("\n").map((str, i, arr) => {
    return i === arr.length - 1 ? (
      str
    ) : (
      <Fragment key={i}>
        {str}
        <br key={i} />
      </Fragment>
    )
  })

  return translatedWithLineBreaks
}

export { getLocale, setLocale, t }
