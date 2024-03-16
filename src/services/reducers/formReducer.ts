import { debounce } from "@/common/utils/debounce"
import { STORE_VERSION, defaultFormValues, defaultSliderValue } from "@/config"
import type { FormState, InputValue, PassCreationRules } from "@/models"
import { Language } from "@/models/translations"
import { set } from "idb-keyval"

const isDev = import.meta.env.DEV

export const initialFormState: FormState = {
  formValues: defaultFormValues,
  sliderValue: defaultSliderValue,
  language: Language.fi,
  isDisabled: false,
  isEditing: false,
  dataset: {
    deletedDatasets: [],
    failedToFetchDatasets: [],
  },
}

export enum FormActionKind {
  SET_FORM_STATE = "setFormState",
  SET_FORM_VALUES = "setFormValues",
  SET_FORM_FIELD = "setFormField",
  SET_SLIDERVALUE = "setSlidervalue",
  TOGGLE_FIELD = "toggleSelectedField",
  SET_DISABLED = "setDisabled",
  SET_EDITING = "setEditing",
  SET_LANGUAGE = "setLanguage",
  SET_DATASET_FIELDS = "setDatasetFields",
}

/** Actions */
export type SetSliderValueAction = {
  type: FormActionKind.SET_SLIDERVALUE
  payload: number
}
type SetFormFieldAction = {
  type: FormActionKind.SET_FORM_FIELD
  payload: {
    field: keyof PassCreationRules
    language?: Language
    selected?: InputValue["selected"]
    value?: InputValue["value"]
  }
}

type SetDatasetFieldsAction = {
  type: FormActionKind.SET_DATASET_FIELDS
  payload: FormState["dataset"]
}

type SetLanguageAction = { type: FormActionKind.SET_LANGUAGE; payload: Language }
type SetFormStateAction = { type: FormActionKind.SET_FORM_STATE; payload: FormState }
export type FormActions =
  | SetFormStateAction
  | { type: FormActionKind.SET_FORM_VALUES; payload: PassCreationRules }
  | SetFormFieldAction
  | SetSliderValueAction
  | { type: FormActionKind.TOGGLE_FIELD; payload: keyof PassCreationRules }
  | { type: FormActionKind.SET_DISABLED; payload: boolean }
  | { type: FormActionKind.SET_EDITING; payload: boolean }
  | SetLanguageAction
  | SetDatasetFieldsAction

export default function reducer(state: FormState, action: FormActions): FormState {
  switch (action.type) {
    case FormActionKind.SET_FORM_STATE:
      return action.payload
    case FormActionKind.SET_FORM_VALUES:
      return { ...state, formValues: action.payload }
    case FormActionKind.SET_FORM_FIELD:
      if (action.payload.selected !== undefined) {
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
    case FormActionKind.SET_DISABLED:
      return { ...state, isDisabled: action.payload }
    case FormActionKind.SET_EDITING:
      return { ...state, isEditing: action.payload }
    case FormActionKind.SET_DATASET_FIELDS:
      return { ...state, dataset: action.payload }
    case FormActionKind.SET_LANGUAGE:
      return { ...state, language: action.payload }

    default:
      return state
  }
}

export const setSlidervalue = (value: number): SetSliderValueAction => ({
  type: FormActionKind.SET_SLIDERVALUE,
  payload: value,
})

export const setFormField = (payload: SetFormFieldAction["payload"]): SetFormFieldAction => ({
  type: FormActionKind.SET_FORM_FIELD,
  payload,
})

export const setEditing = (payload: boolean) => ({
  type: FormActionKind.SET_EDITING,
  payload,
})

export const setLanguage = (payload: Language): SetLanguageAction => ({
  type: FormActionKind.SET_LANGUAGE,
  payload,
})

export const setDatasetFields = (payload: FormState["dataset"]): SetDatasetFieldsAction => ({
  type: FormActionKind.SET_DATASET_FIELDS,
  payload,
})

export const resetFormState = (): SetFormStateAction => ({
  type: FormActionKind.SET_FORM_STATE,
  payload: initialFormState,
})

/**
 * Sets the given state directly to localStorage & indexedDB
 * @param payload state to set
 */
export const setFormState = async (payload: FormState): Promise<void> => {
  localStorage.setItem(`formState-V${STORE_VERSION}`, JSON.stringify(payload))
  debouncedSetFormState(payload)
}

const debouncedSetFormState = debounce(async (payload: FormState) => {
  isDev && console.time("set-formState")
  await set(`formState-V${STORE_VERSION}`, payload)
  isDev && console.timeEnd("set-formState")
}, 300)
