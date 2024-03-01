import { usePersistedReducer } from "@/common/hooks/usePersistedReducer"
import { useLanguage } from "@/common/utils/getLanguage"
import { maxLengthForWords, minLengthForChars } from "@/config"
import {
  FormContextProps,
  FormDispatchContextProps,
  FormState,
  PassCreationRules,
  ResultContextProps,
  ResultState,
} from "@/models"
import { Language } from "@/models/translations"
import { createPassphrase } from "@/services/createCrypto"
import { Stores, getDataForKey, setData } from "@/services/database/db"
import reducer, {
  FormActionKind,
  initialFormState,
  setSlidervalue,
} from "@/services/reducers/formReducer"
import { ReactNode, createContext, useCallback, useEffect, useState } from "react"

const isDev = import.meta.env.DEV

const API_KEY = import.meta.env.VITE_X_API_KEY
const API_URL = isDev ? "http://localhost:8787" : import.meta.env.VITE_API_URL
const { SET_DISABLED, SET_FORM_FIELD } = FormActionKind

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
  const [formState, dispatch] = usePersistedReducer(reducer, initialFormState, "formState")
  const { language } = useLanguage()

  if (!Object.keys(formState.formValues).includes("language")) {
    dispatch({
      type: SET_FORM_FIELD,
      payload: {
        field: "language",
        language: initialFormState.formValues.language,
      },
    })
  }

  const [finalPassword, setFinalPassword] = useState<ResultState>({
    passwordValue: undefined,
    isEdited: false,
  })

  if (!dispatch) {
    throw new Error("No dispatch found from context")
  }

  const validate = useCallback(
    (sliderValue: number, state: FormState): number => {
      const { selected } = state.formValues.words
      if (
        selected &&
        (sliderValue > maxLengthForWords || sliderValue < 1) // should return false
      ) {
        dispatch(setSlidervalue(maxLengthForWords))
        return maxLengthForWords
      } else if (!selected && sliderValue < minLengthForChars) {
        dispatch(setSlidervalue(minLengthForChars))
        return minLengthForChars
      }
      return sliderValue
    },
    [formState.formValues],
  )

  async function generatePassword(formValues: PassCreationRules, sliderValue: number) {
    const { language, words } = formValues
    if (words.selected) {
      if (temp_dataset && temp_dataset.dataset.length && temp_dataset.language === language) {
        console.log("temp_dataset hit")
        return createPassphrase({
          passLength: sliderValue,
          inputs: formValues,
          dataset: temp_dataset.dataset,
        })
      }
      const dataset = await fetchDataset(language)
      if (dataset) {
        console.log("dataset fetched successfully")
        temp_dataset = { language, dataset }
        return createPassphrase({ passLength: sliderValue, inputs: formValues, dataset })
      }
      console.warn(`got no dataset for language: "${language}", falling back to regular password`)
    }
    return createPassphrase({ passLength: sliderValue, inputs: formValues })
  }

  const fetchDataset = async (lang: Language) => {
    try {
      console.info("getting data for: ", lang)
      const datasetFromDB = await getDataForKey(Stores.Languages, lang)
      if (datasetFromDB) return datasetFromDB
      // Set the password undefined to trigger loading state on fetch only - preventing a flash on DB lang change
      setFinalPassword({ isEdited: false, passwordValue: undefined })

      const response = await fetch(`${API_URL}/dataset/${lang}`, {
        headers: {
          "X-API-KEY": API_KEY || "",
        },
      })
      if (!response.ok) {
        await response.body?.cancel()
        throw new Error("Failed to fetch dataset")
      }
      const data = (await response.json()) as string[]
      const keySetToDb = await setData(Stores.Languages, data, lang)
      if (keySetToDb === lang) {
        // all OK
        return data
      }
      return undefined
    } catch (error) {
      console.error("Error fetching dataset:", error)
      return undefined
    }
  }

  useEffect(() => {
    const fetchOnChange = async () => await fetchDataset(language)
    return () => void fetchOnChange()
  }, [language])

  const generate = useCallback(async () => {
    inputFieldShouldDisable()
      ? dispatch({ type: SET_DISABLED, payload: true })
      : dispatch({ type: SET_DISABLED, payload: false })
    try {
      console.log("formState", formState)

      const password = await generatePassword(
        formState.formValues,
        validate(formState.sliderValue, formState),
      )
      setFinalPassword({ passwordValue: password, isEdited: false })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
  }, [formState.formValues, formState.sliderValue])

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
