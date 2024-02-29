import { defaultFormValues, defaultSliderValue } from "@/config"
import { FormState, InputValue, PassCreationRules } from "@/models"
import { Language } from "@/models/translations"

export const initialFormState: FormState = {
  formValues: defaultFormValues,
  sliderValue: defaultSliderValue,
  isDisabled: false,
  isEditing: false,
}

export enum FormActionKind {
  SET_FORM_VALUES = "setFormValues",
  SET_FORM_FIELD = "setFormField",
  SET_SLIDERVALUE = "setSlidervalue",
  TOGGLE_FIELD = "toggleSelectedField",
  SET_DISABLED = "setDisabled",
  SET_EDITING = "setEditing",
}

/** Actions */
export type SetSliderValueAction = { type: FormActionKind.SET_SLIDERVALUE; payload: number }
type SetFormFieldAction = {
  type: FormActionKind.SET_FORM_FIELD
  payload: {
    field: keyof PassCreationRules
    language: Language
    selected?: InputValue["selected"]
    value?: InputValue["value"]
  }
}

export type FormActions =
  | { type: FormActionKind.SET_FORM_VALUES; payload: PassCreationRules }
  | SetFormFieldAction
  | SetSliderValueAction
  | { type: FormActionKind.TOGGLE_FIELD; payload: keyof PassCreationRules }
  | { type: FormActionKind.SET_DISABLED; payload: boolean }
  | { type: FormActionKind.SET_EDITING; payload: boolean }

function reducer(state: FormState, action: FormActions): FormState {
  switch (action.type) {
    case FormActionKind.SET_FORM_VALUES:
      return { ...state, formValues: action.payload }
    case FormActionKind.SET_FORM_FIELD:
      if (action.payload.selected !== undefined) {
        if (action.payload.field === "language") {
          return {
            ...state,
            formValues: {
              ...state.formValues,
              language: action.payload.language,
            },
          }
        }

        return {
          ...state,
          formValues: {
            ...state.formValues,
            [action.payload.field]: {
              ...state.formValues[action.payload.field],
              selected: action.payload.selected,
            },
          },
        }
      } else {
        if (action.payload.field === "language") {
          return {
            ...state,
            formValues: {
              ...state.formValues,
              language: action.payload.language,
            },
          }
        }

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
      if (action.payload === "language") {
        return state
      }

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
    case FormActionKind.SET_DISABLED:
      return { ...state, isDisabled: action.payload }
    case FormActionKind.SET_EDITING:
      return { ...state, isEditing: action.payload }
    default:
      return state
  }
}

export const setSlidervalue = (value: number): SetSliderValueAction => ({
  type: FormActionKind.SET_SLIDERVALUE,
  payload: value,
})

export const setFormField = (payload: SetFormFieldAction["payload"]) => ({
  type: FormActionKind.SET_FORM_FIELD,
  payload,
})

export const setEditing = (payload: boolean) => ({
  type: FormActionKind.SET_EDITING,
  payload,
})

export default reducer
