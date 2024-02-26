import { usePersistedReducer } from "@/common/hooks/usePersistedReducer"
import { maxLengthForWords, minLengthForChars } from "@/config"
import {
  FormContextProps,
  FormDispatchContextProps,
  FormState,
  IndexableFormValues,
  ResultContextProps,
  ResultState,
} from "@/models"
import { createCryptoKey } from "@/services/createCrypto"
import reducer, {
  FormActionKind,
  initialFormState,
  setSlidervalue,
} from "@/services/reducers/formReducer"
import { ReactNode, createContext, useCallback, useState } from "react"

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
  const [finalPassword, setFinalPassword] = useState<ResultState>({
    passwordValue: undefined,
    isEdited: false,
  })

  const { SET_DISABLED } = FormActionKind
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

  function generatePassword(formValues: IndexableFormValues, sliderValue: number) {
    return createCryptoKey(sliderValue.toString(), formValues)
  }

  const generate = useCallback(async () => {
    inputFieldShouldDisable()
      ? dispatch({ type: SET_DISABLED, payload: true })
      : dispatch({ type: SET_DISABLED, payload: false })
    try {
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
