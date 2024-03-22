import { useTranslation } from "@/common/hooks/useLanguage"
import type { InputLabel } from "@/models"
import { Language } from "@/models/translations"

/** The version number for IDB stores to allow for sunsetting KV pairs */
export const STORE_VERSION = 1 as const
/** Form state's key in localStorage and IDB */
export const FORM_STATE_KEY = `formState-V${STORE_VERSION}`

export const supportedLanguages = Object.values(Language)
export const inputFieldMaxLength = 8

export function labelForCheckbox(option: InputLabel) {
  const { t } = useTranslation()

  const labels: Record<InputLabel, ReturnType<typeof t>> = {
    uppercase: t("useUppercase"),
    randomChars: t("useSeparator"),
    numbers: t("useNumbers"),
    words: t("useWords"),
  }
  return labels[option] || labels.words
}
