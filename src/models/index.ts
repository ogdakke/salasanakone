import { Language, Translations } from "@/models/translations"
import { FormActions } from "@/services/reducers/formReducer"
import { Dispatch } from "react"

export type CheckboxLabels = "Isot Kirjaimet" | "Välimerkit" | "Numerot" | "Käytä sanoja" // TODO fix this to be translated

export type InputType = "checkbox" | "input" | "radio"
export type InputLabel = "words" | "uppercase" | "numbers" | "randomChars"
export type IndexedLabels = Record<InputLabel, CheckboxLabels>

export interface InputValue {
  inputType: InputType
  selected: boolean
  info: keyof Translations
  value?: string
}

export interface PassCreationRules {
  words: InputValue
  uppercase: InputValue
  numbers: InputValue
  randomChars: InputValue
}

export type FormState = {
  formValues: PassCreationRules
  sliderValue: number
  isDisabled: boolean
  isEditing: boolean
  language: Language
  dataset: {
    hasDeletedDatasets: boolean
    noDatasetFetched: boolean
  }
}

export type FormContextProps = {
  formState: FormState
  generate: () => Promise<void>
  validate?: (value: number, state: FormState) => number
}

export type FormDispatchContextProps = {
  dispatch: Dispatch<FormActions>
}

/**
 * isEdited is to differentiate edited (user-inputted) passwords from generated ones
 */
export type ResultState = {
  passwordValue?: string
  isEdited: boolean
}

export type ResultContextProps = {
  finalPassword: ResultState
  setFinalPassword: Dispatch<React.SetStateAction<ResultState>>
}
