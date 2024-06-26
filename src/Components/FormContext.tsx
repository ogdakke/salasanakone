import { useEffectOnce } from "@/common/hooks/useEffectOnce"
import { usePersistedReducer } from "@/common/hooks/usePersistedReducer"
import { FormContext, FormDispatchContext } from "@/common/providers/FormProvider"
import { ResultContext } from "@/common/providers/ResultProvider"
import { isKey } from "@/common/utils/helpers"
import { validatePasswordLength } from "@/common/utils/validations"
import { FORM_STATE_KEY } from "@/config"
import { initialFormState } from "@/config/form-config/form-state.config"
import type { FormState, ResultState } from "@/models"
import type { Language } from "@/models/translations"
import { createPassphrase } from "@/services/createCrypto"
import { Stores, getDataForKey, setData } from "@/services/database/db"
import { setFormState } from "@/services/database/state"
import reducer, { resetFormState, setLanguage } from "@/services/reducers/formReducer"
import { del, get } from "idb-keyval"
import { type ReactNode, useCallback, useRef, useState } from "react"

const isDev = import.meta.env.DEV
const API_URL = isDev ? "http://localhost:8787" : import.meta.env.VITE_API_URL

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
    FORM_STATE_KEY,
  )
  const [finalPassword, setFinalPassword] = useState<ResultState>({
    passwordValue: undefined,
    isEdited: false,
  })

  // Handle regression of stored values
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Here we check for regressions, eg. values in localStorage that need to be removed
  async function handleRegresion() {
    let regressed = []
    console.debug("running regressions...")

    if (localStorage.getItem("formState")) {
      localStorage.removeItem("formState")
      regressed.push("formState")
    }

    if (await get("formState")) {
      await del("formState")
      regressed.push("idb-formState")
    }

    if (
      !("fetchedDatasets" in formState.dataset) ||
      formState.dataset?.fetchedDatasets === undefined
    ) {
      formState.dataset.fetchedDatasets = []
      regressed.push("fetchedDatasets")
    }

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
          del(FORM_STATE_KEY)
          return dispatch(resetFormState())
        }
      }
    }

    if (!Array.isArray(formState.dataset.deletedDatasets)) {
      regressed.push("deletedDatasets")
      clearValue()
      await del(FORM_STATE_KEY)
      dispatch(resetFormState())
    }

    if (!Array.isArray(formState.dataset.failedToFetchDatasets)) {
      regressed.push("failedToFetchDatasets")
      clearValue()
      await del(FORM_STATE_KEY)
      dispatch(resetFormState())
    }

    if (regressed.length) {
      console.info("regressed", regressed)
    }
  }

  if (!hasCheckedRegressions) {
    ;(async () => await handleRegresion())()
    hasCheckedRegressions = true
  }

  async function generatePassword(state: FormState, cache?: "invalidate") {
    if (cache === "invalidate") {
      temp_dataset = { dataset: [], language: state.language }
      isDev && console.debug("invalidated dataset cache with flag")
    }

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

      if (dataset) {
        temp_dataset = { language: state.language, dataset }
        return createPassphrase({
          passLength: validatedLength,
          inputs: formValues,
          dataset,
          language: state.language,
        })
      }
      console.info(
        `got no dataset for language: "${state.language}", falling back to regular password`,
      )
    }
    return createPassphrase({
      passLength: validatedLength,
      inputs: formValues,
      language: state.language,
    })
  }

  const lastAbortController = useRef<AbortController>()

  const fetchDataset = async (lang: Language): Promise<string[] | undefined> => {
    if (lastAbortController.current) {
      lastAbortController.current.abort()
    }

    const currentAbortController = new AbortController()
    lastAbortController.current = currentAbortController

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
        currentAbortController.abort()
        return undefined
      }
      // Set the password undefined to trigger loading state on fetch only - preventing a flash on DB lang change
      setFinalPassword({ isEdited: false, passwordValue: undefined })

      const url = `${API_URL}/dataset/${lang}`
      const response = await fetch(url, { signal: currentAbortController.signal })

      // TODO handle aborting the fetch when language changes or something idfk
      if (!response.ok) {
        await response.body?.cancel()
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

    const { fetchedDatasets } = formState.dataset
    if (!fetchedDatasets.includes(lang)) {
      formState.dataset.fetchedDatasets.push(lang)
    }

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

  const generate = useCallback(async (state: FormState, cache?: "invalidate") => {
    await setFormState(state)
    try {
      const passwordValue = await generatePassword(state, cache)
      setFinalPassword({ passwordValue, isEdited: false })
    } catch (error) {
      if (error instanceof Error) {
        // TODO handle the error
        throw new Error(error.message)
      }
    }
  }, [])

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
