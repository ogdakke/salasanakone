import { initialFormState } from "@/config/form-config/form-state.config"
import type { FormContextProps, FormDispatchContextProps } from "@/models"
import { createContext } from "react"

export const FormContext = createContext<FormContextProps>({
  formState: initialFormState,
  generate: async () => {},
})

export const FormDispatchContext = createContext<FormDispatchContextProps>({
  dispatch: () => undefined,
})
