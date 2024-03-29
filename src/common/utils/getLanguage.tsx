import { en, fi } from "@/assets/texts"

import { Language, type TranslationKey } from "@/models/translations"
import { Fragment } from "react"

export const translate = (
  language: Language,
  key: TranslationKey,
  placeholders?: Record<PropertyKey, string>,
): (string | React.ReactNode)[] => {
  let translation = language === Language.fi ? fi[key] : en[key] || key

  if (placeholders) {
    // Handle interpolation
    translation = Object.keys(placeholders).reduce((str, placeholderKey) => {
      const regex = new RegExp(`{${placeholderKey}}`, "g")
      let replacement = placeholders[placeholderKey]
      if (replacement) {
        return str.replace(regex, replacement)
      }
      return str
    }, translation)
  }

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
