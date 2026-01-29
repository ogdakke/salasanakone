import { en, fi } from "@/assets/texts"

import { Language, type TranslationKey } from "@/models/translations"
import { Fragment } from "react"

/**
 * Get raw translation string without React node transformation
 * Used for meta tags, attributes, and other places requiring plain strings
 */
export const translateRaw = (
  language: Language,
  key: TranslationKey,
  placeholders?: Record<PropertyKey, string>,
): string => {
  let translation = language === Language.fi ? fi[key] : en[key] || key

  if (placeholders) {
    translation = Object.keys(placeholders).reduce((str, placeholderKey) => {
      const regex = new RegExp(`{${placeholderKey}}`, "g")
      const replacement = placeholders[placeholderKey]
      if (replacement) {
        return str.replace(regex, replacement)
      }
      return str
    }, translation)
  }

  return translation
}

export const translate = (
  language: Language,
  key: TranslationKey,
  placeholders?: Record<PropertyKey, string>,
): (string | React.ReactNode)[] => {
  const translation = translateRaw(language, key, placeholders)

  const translatedWithLineBreaks = translation.split("\n").map((str, i, arr) => {
    return i === arr.length - 1 ? (
      str
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      <Fragment key={i}>
        {str}
        {/* biome-ignore lint/suspicious/noArrayIndexKey: <explanation> */}
        <br key={i} />
      </Fragment>
    )
  })

  return translatedWithLineBreaks
}
