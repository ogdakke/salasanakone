import { FormProvider } from "@/Components/FormContext"
import { MotionConfig } from "framer-motion"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <FormProvider>
        <App />
      </FormProvider>
    </MotionConfig>
  </React.StrictMode>,
)
