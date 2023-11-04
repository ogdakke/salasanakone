import { defaultFormValues, defaultSliderValue } from "@/../config"
import { IndexableFormValues, InputValue } from "@/models"

export type FormState = {
  formValues: IndexableFormValues
  sliderValue: number
  finalPassword?: string
  isDisabled: boolean
}

export const initialFormState: FormState = {
  formValues: defaultFormValues,
  sliderValue: defaultSliderValue,
  isDisabled: false,
}

export enum FormActionKind {
  SET_FORM_VALUES = "setFormValues",
  SET_FORM_FIELD = "setFormField",
  SET_SLIDERVALUE = "setSlidervalue",
  TOGGLE_FIELD = "toggleSelectedField",
  SET_FINALPASSWORD = "setFinalPassword",
  SET_DISABLED = "setDisabled",
}

export type FormActions =
  | { type: FormActionKind.SET_FORM_VALUES; payload: IndexableFormValues }
  | {
      type: FormActionKind.SET_FORM_FIELD
      payload: {
        field: keyof IndexableFormValues
        selected?: InputValue["selected"]
        value?: InputValue["value"]
      }
    }
  | { type: FormActionKind.SET_SLIDERVALUE; payload: FormState["sliderValue"] }
  | { type: FormActionKind.TOGGLE_FIELD; payload: keyof IndexableFormValues }
  | { type: FormActionKind.SET_FINALPASSWORD; payload: string }
  | { type: FormActionKind.SET_DISABLED; payload: boolean }

function reducer(state: FormState, action: FormActions): FormState {
  switch (action.type) {
    case FormActionKind.SET_FORM_VALUES:
      return { ...state, formValues: action.payload }
    case FormActionKind.SET_FORM_FIELD:
      if (action.payload.selected !== undefined) {
        return {
          ...state,
          formValues: {
            ...state.formValues,
            [action.payload.field]: {
              selected: action.payload.selected,
            },
          },
        }
      } else {
        return {
          ...state,
          formValues: {
            ...state.formValues,
            [action.payload.field]: {
              ...state.formValues[action.payload.field],
              value: action.payload.value,
            },
          },
        }
      }
    case FormActionKind.SET_SLIDERVALUE:
      return { ...state, sliderValue: action.payload }
    case FormActionKind.TOGGLE_FIELD:
      return {
        ...state,
        formValues: {
          ...state.formValues,
          [action.payload]: {
            ...state.formValues[action.payload],
            selected: !state.formValues[action.payload].selected,
          },
        },
      }
    case FormActionKind.SET_FINALPASSWORD:
      return { ...state, finalPassword: action.payload }
    case FormActionKind.SET_DISABLED:
      return { ...state, isDisabled: action.payload }
    default:
      throw new Error()
  }
}

export default reducer

