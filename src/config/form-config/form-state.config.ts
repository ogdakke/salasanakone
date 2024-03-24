import type { FormState, PassCreationRules } from "@/models"
import { Language } from "@/models/translations"

export const defaultSliderValue = 3
export const defaultFormValues: PassCreationRules = {
  words: {
    inputType: "radio",
    selected: true,
  },
  uppercase: {
    inputType: "checkbox",
    selected: true,
  },
  numbers: {
    inputType: "checkbox",
    selected: true,
  },
  randomChars: {
    inputType: "input",
    value: "-",
    selected: true,
  },
}

export const initialFormState: FormState = {
  formValues: defaultFormValues,
  sliderValue: defaultSliderValue,
  language: Language.fi,
  isDisabled: false,
  isEditing: false,
  dataset: {
    deletedDatasets: [],
    failedToFetchDatasets: [],
    fetchedDatasets: [],
  },
}
