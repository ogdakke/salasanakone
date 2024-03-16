import { FormContext, FormDispatchContext } from "@/common/providers/FormProvider"
import { translate } from "@/common/utils/getLanguage"
import type { Language, TranslationKey } from "@/models/translations"
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
