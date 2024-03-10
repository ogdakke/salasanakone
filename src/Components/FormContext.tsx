import { usePersistedReducer } from "@/common/hooks/usePersistedReducer"
import { useLanguage } from "@/common/utils/getLanguage"
import { maxLengthForWords, minLengthForChars } from "@/config"
import type {
  FormContextProps,
  FormDispatchContextProps,
  FormState,
  ResultContextProps,
  ResultState,
} from "@/models"
import type { Language } from "@/models/translations"
import { createPassphrase } from "@/services/createCrypto"
import { Stores, getDataForKey, setData } from "@/services/database/db"
import reducer, {
  FormActionKind,
  initialFormState,
  resetFormState,
  setDatasetFields,
  setFormField,
  setLanguage,
  setSlidervalue,
} from "@/services/reducers/formReducer"
import { type ReactNode, createContext, useCallback, useEffect, useState } from "react"
const { SET_DISABLED } = FormActionKind

const isDev = import.meta.env.DEV
const API_KEY = import.meta.env.VITE_X_API_KEY
const importedApiUrl = import.meta.env.VITE_API_URL
const API_URL = isDev ? "http://localhost:8787" : importedApiUrl

let temp_dataset: {
  language: Language
  dataset: string[]
}

export const FormContext = createContext<FormContextProps>({
  formState: initialFormState,
  generate: async () => {},
})

export const FormDispatchContext = createContext<FormDispatchContextProps>({
  dispatch: () => undefined,
})

export const ResultContext = createContext<ResultContextProps>({
  finalPassword: { isEdited: false },
  setFinalPassword: () => undefined,
})

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formState, dispatch, clearValue] = usePersistedReducer(
    reducer,
    initialFormState,
    "formState",
  )
  const { language } = useLanguage()

  // Handle regression of localstorage values
  if (Object.keys(formState.formValues).includes("language")) {
    clearValue()
    dispatch(setLanguage(initialFormState.language))
  }

  if (!Array.isArray(formState.dataset.deletedDatasets)) {
    clearValue()
    dispatch(resetFormState())
  }

  if (!Array.isArray(formState.dataset.failedToFetchDatasets)) {
    clearValue()
    dispatch(resetFormState())
  }

  const [finalPassword, setFinalPassword] = useState<ResultState>({
    passwordValue: undefined,
    isEdited: false,
  })

  if (!dispatch) {
    throw new Error("No dispatch found from context")
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const validate = useCallback(
    (sliderValue: number, state: FormState): number => {
      const { selected } = state.formValues.words
      if (
        selected &&
        (sliderValue > maxLengthForWords || sliderValue < 1) // should return false
      ) {
        dispatch(setSlidervalue(maxLengthForWords))
        return maxLengthForWords
      }
      if (!selected && sliderValue < minLengthForChars) {
        dispatch(setSlidervalue(minLengthForChars))
        return minLengthForChars
      }
      return sliderValue
    },
    [formState.formValues],
  )

  async function generatePassword(formState: FormState) {
    const { formValues, language, sliderValue } = formState
    const validatedLength = validate(sliderValue, formState)

    if (formValues.words.selected) {
      if (temp_dataset?.dataset.length && temp_dataset.language === language) {
        return createPassphrase({
          passLength: validatedLength,
          inputs: formValues,
          dataset: temp_dataset.dataset,
          language,
        })
      }
      const dataset = await fetchDataset(language)
      if (dataset && Array.isArray(dataset)) {
        temp_dataset = { language, dataset }
        return createPassphrase({
          passLength: validatedLength,
          inputs: formValues,
          language,
          dataset,
        })
      }
      console.warn(`got no dataset for language: "${language}", falling back to regular password`)
    }
    return createPassphrase({
      passLength: validatedLength,
      inputs: formValues,
      language,
    })
  }

  const fetchDataset = async (lang: Language) => {
    try {
      const datasetFromDB = await getDataForKey(Stores.Languages, lang)
      if (datasetFromDB) {
        handleFetchSuccess(lang)
        return datasetFromDB
      }
      // Set the password undefined to trigger loading state on fetch only - preventing a flash on DB lang change
      setFinalPassword({ isEdited: false, passwordValue: undefined })

      const url = `${API_URL}/dataset/${lang}`
      const response = await fetch(url, {
        headers: {
          "X-API-KEY": API_KEY || "",
        },
      })
      if (!response.ok) {
        await response.body?.cancel()
        handleFetchError(lang)
        throw new Error("Failed to fetch dataset")
      }

      const data = (await response.json()) as string[]
      const keySetToDb = await setData(Stores.Languages, data, lang)
      if (keySetToDb === lang) {
        // all OK
        handleFetchSuccess(lang)
        return data
      }

      handleFetchError(lang)
      return undefined
    } catch (error) {
      console.error("Error fetching dataset:", error)
      handleFetchError(lang)
      return undefined
    }
  }

  function handleFetchSuccess(lang: Language) {
    const currentDataset = formState.dataset
    const deletedDatasets = currentDataset.deletedDatasets
    const updatedDeletedDatasets = deletedDatasets.filter((dataset) => dataset !== lang)
    const updatedFailedToFetchDatasets = formState.dataset.failedToFetchDatasets.filter(
      (dataset) => dataset !== lang,
    )
    dispatch(
      setDatasetFields({
        deletedDatasets: updatedDeletedDatasets,
        failedToFetchDatasets: updatedFailedToFetchDatasets,
      }),
    )
  }

  function handleFetchError(lang: Language): void {
    console.warn("fetch failure, dispatching")
    const langs = formState.dataset.failedToFetchDatasets
    if (langs.includes(lang)) {
      dispatch(setFormField({ field: "words", selected: false }))
      return
    }
    dispatch(
      setDatasetFields({
        ...formState.dataset,
        failedToFetchDatasets: [...formState.dataset.failedToFetchDatasets, lang],
      }),
    )
    dispatch(setFormField({ field: "words", selected: false }))
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchOnChange = async () => await fetchDataset(language)
    return () => void fetchOnChange()
  }, [language])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const generate = useCallback(async () => {
    inputFieldShouldDisable()
      ? dispatch({ type: SET_DISABLED, payload: true })
      : dispatch({ type: SET_DISABLED, payload: false })
    try {
      const passwordValue = await generatePassword(formState)
      setFinalPassword({ passwordValue, isEdited: false })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
  }, [formState.formValues, formState.sliderValue, formState.dataset])

  const inputFieldShouldDisable = () => {
    return formState.formValues.words.selected && formState.sliderValue < 2
  }

  return (
    <FormContext.Provider value={{ formState, generate, validate }}>
      <FormDispatchContext.Provider value={{ dispatch }}>
        <ResultContext.Provider value={{ finalPassword, setFinalPassword }}>
          {children}
        </ResultContext.Provider>
      </FormDispatchContext.Provider>
    </FormContext.Provider>
  )
}
