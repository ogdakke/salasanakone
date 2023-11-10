import { FormActions } from "@/services/reducers/formReducer"
import { Dispatch } from "react"

export type CheckboxLabels = "Isot Kirjaimet" | "Välimerkit" | "Numerot" | "Käytä sanoja"

export type InputType = "checkbox" | "input" | "radio"
export type InputLabel = "words" | "uppercase" | "numbers" | "randomChars"
export type IndexedLabels = Record<InputLabel, CheckboxLabels>

export interface InputValue {
  inputType: InputType
  value?: string
  selected: boolean
  info: string
}

export type IndexableFormValues = {
  words: InputValue
  uppercase: InputValue
  numbers: InputValue
  randomChars: InputValue
}

export type FormState = {
  formValues: IndexableFormValues
  sliderValue: number
  isDisabled: boolean
  isEditing: boolean
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

