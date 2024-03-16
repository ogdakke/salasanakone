import type { FormContextProps, FormDispatchContextProps } from "@/models"
import { initialFormState } from "@/services/reducers/formReducer"
import { createContext } from "react"

export const FormContext = createContext<FormContextProps>({
  formState: initialFormState,
  generate: async () => {},
})

export const FormDispatchContext = createContext<FormDispatchContextProps>({
  dispatch: () => undefined,
})
