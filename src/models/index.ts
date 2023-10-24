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

export type ApiSalaCall = {
  lang?: "fi" | "en"
  passLength: number
  inputValues: IndexableFormValues
}
export type SalaApiResponse = {
  passphrase: string
  passLength: number
}
