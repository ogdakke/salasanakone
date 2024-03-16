import { useTranslation } from "@/common/hooks/useLanguage"
import type { InputLabel, PassCreationRules } from "@/models"
import { Language } from "@/models/translations"

/** The version number for IDB stores to allow for sunsetting KV pairs */
export const STORE_VERSION = 1 as const
export const supportedLanguages = Object.values(Language)
export const inputFieldMaxLength = 8
export const defaultSliderValue = 3
export const defaultFormValues: PassCreationRules = {
  words: {
    inputType: "radio",
    selected: true,
  },
  uppercase: {
    inputType: "checkbox",
    selected: false,
  },
  numbers: {
    inputType: "checkbox",
    selected: true,
  },
  randomChars: {
    inputType: "input",
    value: "-",
    selected: false,
  },
}

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
