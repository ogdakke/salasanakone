import { FormProvider } from "@/Components/FormContext"
import { Credits } from "@/Components/ui/credits"
import { MotionConfig } from "framer-motion"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

// Main app
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <FormProvider>
        <App />
      </FormProvider>
    </MotionConfig>
  </React.StrictMode>,
)

// Credits (footer)
const creditsRoot = document.getElementById("credits-root")
if (creditsRoot) {
  ReactDOM.createRoot(creditsRoot).render(
    <React.StrictMode>
      <FormProvider>
        <Credits />
      </FormProvider>
    </React.StrictMode>,
  )
}
