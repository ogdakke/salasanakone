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

export type Lang = "fi" | "en" | "se"
export type IndexableInputValue = {
  [key in InputLabel]: InputValue
}

export interface ApiSalaCall {
  lang?: Lang
  passLength: number
  inputValues: IndexableInputValue
}
