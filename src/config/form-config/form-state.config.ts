import { detectLanguageFromUrl } from "@/common/utils/detectLanguage"
import type { FormState, PassCreationRules } from "@/models"
import { Language } from "@/models/translations"

const defaultSliderValue = 3
const defaultFormValues: PassCreationRules = {
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

/**
 * Get initial language from URL path
 * This ensures the app respects the MPA URL structure
 */
function getInitialLanguage(): Language {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    return detectLanguageFromUrl()
  }
  return Language.fi
}

export const initialFormState: FormState = {
  formValues: defaultFormValues,
  sliderValue: defaultSliderValue,
  language: getInitialLanguage(),
  isDisabled: false,
  isEditing: false,
  dataset: {
    deletedDatasets: [],
    failedToFetchDatasets: [],
    fetchedDatasets: [],
  },
}
