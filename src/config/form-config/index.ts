import { useTranslation } from "@/common/utils/getLanguage"
import { InputLabel, PassCreationRules } from "@/models"
import { Language } from "@/models/translations"

export const inputFieldMaxLength = 8
export const defaultSliderValue = 3
export const defaultFormValues: PassCreationRules = {
  language: Language.fi,
  words: {
    inputType: "radio",
    selected: true,
    info: "Luodaanko salalause sanoista?",
  },
  uppercase: {
    inputType: "checkbox",
    selected: false,
    info: "Sisältääkö Salasana isoja kirjaimia.",
  },
  numbers: {
    inputType: "checkbox",
    selected: true,
    info: "Sisällytetäänkö salasanaan numeroita",
  },
  randomChars: {
    inputType: "input",
    value: "-",
    selected: false,
    info: "Välimerkki, joka yhdistää sanat.",
  },
}

export function labelForCheckbox(option: InputLabel) {
  const { t } = useTranslation()

  const labels = {
    uppercase: t("useUppercase"),
    randomChars: t("useDenominator"),
    numbers: t("useNumbers"),
    words: t("useWords"),
    language: "",
  }
  return labels[option] || labels.words
}
