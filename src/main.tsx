import { ThemeProvider } from "@/Components/providers"
import { FormProvider } from "@/Components/providers/FormProvider"
import { MotionConfig } from "framer-motion"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

export const createCrypto = import("./services/createCrypto")
  .then((res) => {
    return res.createCryptoKey
  })
  .catch((err) => {
    console.error(err, "Failed to import script")
    throw err
  })

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <FormProvider>
          <App />
        </FormProvider>
      </ThemeProvider>
    </MotionConfig>
  </React.StrictMode>,
)

