import { generatePassword } from "@/Components/form"
import { usePersistedReducer } from "@/common/hooks/usePersistedReducer"
import { maxLengthForWords, minLengthForChars } from "@/config"
import reducer, {
  FormActionKind,
  FormActions,
  FormState,
  initialFormState,
  setSlidervalue,
} from "@/services/reducers/formReducer"
import { Dispatch, ReactNode, createContext, useCallback, useState } from "react"

type FormContextProps = {
  formState: FormState
  generate: () => void
  validate?: (value: number, state: FormState) => number
}

export const FormContext = createContext<FormContextProps>({
  formState: initialFormState,
  generate: () => undefined,
})

type FormDispatchContextProps = {
  dispatch: Dispatch<FormActions>
}

export const FormDispatchContext = createContext<FormDispatchContextProps>({
  dispatch: () => undefined,
})

/**
 * isEdited is to differentiate edited (user-inputted) passwords from generated ones
 */
type ResultState = {
  passwordValue?: string
  isEdited: boolean
}

type ResultContextProps = {
  finalPassword: ResultState
  setFinalPassword: Dispatch<React.SetStateAction<ResultState>>
}

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
    (value: number, state: FormState): number => {
      const sliderValue = value
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

  const generate = useCallback(() => {
    inputFieldShouldDisable()
      ? dispatch({ type: SET_DISABLED, payload: true })
      : dispatch({ type: SET_DISABLED, payload: false })
    try {
      const password = generatePassword(
        formState.formValues,
        validate(formState.sliderValue, formState),
      )
      setFinalPassword({ passwordValue: password, isEdited: false })
    } catch (err) {
      console.error(err)
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
