import { useTranslation } from "@/common/utils/getLanguage"
import { InputLabel, PassCreationRules } from "@/models"

export const inputFieldMaxLength = 8
export const defaultSliderValue = 3
export const defaultFormValues: PassCreationRules = {
  words: {
    inputType: "radio",
    selected: true,
    info: "useWordsInfo",
  },
  uppercase: {
    inputType: "checkbox",
    selected: false,
    info: "useUppercaseInfo",
  },
  numbers: {
    inputType: "checkbox",
    selected: true,
    info: "useNumbersInfo",
  },
  randomChars: {
    inputType: "input",
    value: "-",
    selected: false,
    info: "useSeparatorInfo",
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
