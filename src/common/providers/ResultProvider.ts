import type { ResultContextProps } from "@/models"
import { createContext } from "react"

export const ResultContext = createContext<ResultContextProps>({
  finalPassword: { isEdited: false },
  setFinalPassword: () => undefined,
})
