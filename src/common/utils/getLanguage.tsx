import { en, fi } from "@/assets/texts"

import { Language, TranslationKey } from "@/models/translations"
import { Fragment } from "react"

import { FormContext, FormDispatchContext } from "@/Components/FormContext"
import { setLanguage } from "@/services/reducers/formReducer"
import { useContext } from "react"

export const useLanguage = () => {
  const { language } = useContext(FormContext).formState
  return { language, setLanguage: setNewLanguage }
}

function setNewLanguage(newLanguage: Language) {
  const { dispatch } = useContext(FormDispatchContext)
  return dispatch(setLanguage(newLanguage))
}

export const useTranslation = () => {
  const { language } = useLanguage()

  const t = (key: TranslationKey, placeholders?: Record<PropertyKey, string>) => {
    return translate(language, key, placeholders)
  }
  return { t }
}

const translate = (
  language: Language,
  key: TranslationKey,
  placeholders?: Record<PropertyKey, string>,
): (string | JSX.Element)[] => {
  let translation = language === Language.fi ? fi[key] : en[key] || key

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
