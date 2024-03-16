import { useEffectOnce } from "@/common/hooks/useEffectOnce"
import { usePersistedReducer } from "@/common/hooks/usePersistedReducer"
import { FormContext, FormDispatchContext } from "@/common/providers/FormProvider"
import { ResultContext } from "@/common/providers/ResultProvider"
import { isKey } from "@/common/utils/helpers"
import { validatePasswordLength } from "@/common/utils/validations"
import { STORE_VERSION } from "@/config"
import type { FormState, ResultState } from "@/models"
import type { Language } from "@/models/translations"
import { createPassphrase } from "@/services/createCrypto"
import { Stores, getDataForKey, setData } from "@/services/database/db"
import reducer, {
  initialFormState,
  resetFormState,
  setFormState,
  setLanguage,
} from "@/services/reducers/formReducer"
import { del } from "idb-keyval"
import { type ReactNode, useState } from "react"

const isDev = import.meta.env.DEV
const API_KEY = import.meta.env.VITE_X_API_KEY
const importedApiUrl = import.meta.env.VITE_API_URL
const API_URL = isDev ? "http://localhost:8787" : importedApiUrl

let temp_dataset: {
  language: Language
  dataset: string[]
}

let hasCheckedRegressions = false
let isInit = false

export const FormProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const [formState, dispatch, clearValue] = usePersistedReducer(
    reducer,
    initialFormState,
    `formState-V${STORE_VERSION}`,
  )
  const [finalPassword, setFinalPassword] = useState<ResultState>({
    passwordValue: undefined,
    isEdited: false,
  })

  // Handle regression of localstorage values
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Here we check for regressions, eg. values in localStorage that need to be removed
  function handleRegresion() {
    let regressed = []
    localStorage.removeItem("formState")
    del("formState")

    const hasLanguageInFormValues = Object.keys(formState.formValues).includes("language")
    if (hasLanguageInFormValues) {
      regressed.push("language")
      clearValue()
      dispatch(setLanguage(initialFormState.language))
    }

    for (const key in formState.formValues) {
      if (isKey(formState.formValues, key)) {
        let keysOfKey = Object.keys(formState.formValues[key])
        if (keysOfKey.includes("info")) {
          regressed.push({ [key]: "info" })
          clearValue()
          return dispatch(resetFormState())
        }
      }
    }

    if (!Array.isArray(formState.dataset.deletedDatasets)) {
      regressed.push("deletedDatasets")
      clearValue()
      dispatch(resetFormState())
    }

    if (!Array.isArray(formState.dataset.failedToFetchDatasets)) {
      regressed.push("failedToFetchDatasets")
      clearValue()
      dispatch(resetFormState())
    }

    if (regressed.length) {
      console.info("regressed", regressed)
    }
  }

  if (!hasCheckedRegressions) {
    handleRegresion()
    hasCheckedRegressions = true
  }

  async function generatePassword(state: FormState) {
    const { formValues, sliderValue } = state
    const validatedLength = validatePasswordLength(sliderValue, formValues.words.selected)

    if (formValues.words.selected) {
      if (temp_dataset?.dataset.length && temp_dataset.language === state.language) {
        return createPassphrase({
          passLength: validatedLength,
          inputs: formValues,
          dataset: temp_dataset.dataset,
          language: state.language,
        })
      }
      const dataset = await fetchDataset(state.language)

      if (dataset && Array.isArray(dataset)) {
        // console.log("got dataset", dataset[0])
        temp_dataset = { language: state.language, dataset }
        return createPassphrase({
          passLength: validatedLength,
          inputs: formValues,
          dataset,
          language: state.language,
        })
      }
      console.warn(
        `got no dataset for language: "${state.language}", falling back to regular password`,
      )
    }
    return createPassphrase({
      passLength: validatedLength,
      inputs: formValues,
      language: state.language,
    })
  }

  const fetchDataset = async (lang: Language): Promise<string[] | undefined> => {
    try {
      const datasetFromDB = await getDataForKey(Stores.Languages, lang)
      if (datasetFromDB) {
        handleFetchSuccess(lang)
        return datasetFromDB
      }

      if (formState.dataset.failedToFetchDatasets.includes(lang)) {
        isDev && console.log("dataset for language has failed before: ", lang)

        // Dataset has failed fetching before, so don't refetch it
        // TODO: some more logic to handle retries of fetching after some time
        handleFetchError(lang)
        return undefined
      }
      // Set the password undefined to trigger loading state on fetch only - preventing a flash on DB lang change
      setFinalPassword({ isEdited: false, passwordValue: undefined })

      const url = `${API_URL}/dataset/${lang}`
      const response = await fetch(url, {
        headers: {
          "X-API-KEY": API_KEY || "",
        },
      })

      // TODO handle aborting the fetch when language changes or something idfk
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
    formState.dataset.deletedDatasets = updatedDeletedDatasets
    formState.dataset.failedToFetchDatasets = updatedFailedToFetchDatasets
  }

  function handleFetchError(lang: Language): void {
    console.warn("fetch failure, dispatching")

    /** Prepare the formState for switching to words: false by setting it, and validating the sliderValue */
    formState.formValues.words.selected = false
    formState.sliderValue = validatePasswordLength(
      formState.sliderValue,
      formState.formValues.words.selected,
    )

    const langs = formState.dataset.failedToFetchDatasets
    if (langs.includes(lang)) {
      /** Since the failed language is in the array already, just generate with that state */
      generate(formState)
      return
    }
    /** Otherwise push the lang to the array and generate */
    formState.dataset.failedToFetchDatasets.push(lang)
    generate(formState)
  }

  const generate = async (state: FormState) => {
    // isDev && console.log("generate", state)
    await setFormState(state)
    try {
      const passwordValue = await generatePassword(state)
      setFinalPassword({ passwordValue, isEdited: false })
    } catch (error) {
      if (error instanceof Error) {
        // TODO handle the error
        throw new Error(error.message)
      }
    }
  }
  useEffectOnce(() => {
    if (!isInit) {
      isDev && console.debug("generating initial password with: ", formState)
      generate(formState)
    }
  })

  return (
    <FormContext.Provider value={{ formState, generate }}>
      <FormDispatchContext.Provider value={{ dispatch }}>
        <ResultContext.Provider value={{ finalPassword, setFinalPassword }}>
          {children}
        </ResultContext.Provider>
      </FormDispatchContext.Provider>
    </FormContext.Provider>
  )
}
