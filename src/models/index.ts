import type { HighlightCondition } from "@/Components/ui/utils/highlight"
import type { Language } from "@/models/translations"
import type { FormActions } from "@/services/reducers/formReducer"
import type { Dispatch } from "react"

export type InputType = "checkbox" | "input" | "radio"

export interface InputValue {
  inputType: InputType
  selected: boolean
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
    deletedDatasets: Language[]
    failedToFetchDatasets: Language[]
    fetchedDatasets: Language[]
  }
}

export type FormContextProps = {
  formState: FormState
  generate: (state: FormState, cache?: "invalidate") => Promise<void>
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

export type CheckerWorkerPostMessageData =
  | {
      strValue: string
    }
  | Language

export type CopyConditions = {
  isCopied: boolean
  copyIconShouldAnimate: boolean
  copyIconIsHidden: boolean
}

export type EditorProps = {
  handleSave: (stringToSave?: string) => void
}

export type ResultNoEditProps = {
  handleCopyClick: (finalPassword: string) => Promise<void>
  finalPassword: string
  highlightConditions: HighlightCondition[]
  conditions: CopyConditions
}

export type CopiedButtonProps = {
  conditions: CopyConditions
  handleCopyClick: (finalPassword: string) => Promise<void>
}

export type EditButtonProps = {
  handleEditClick: () => void
}

export type InputContextProps = {
  inputValue?: string
  setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>
}
