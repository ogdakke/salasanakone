import { FormProvider } from "@/Components/FormContext"
import { LazyMotion, MotionConfig, domMax } from "framer-motion"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">
        <FormProvider>
          <App />
        </FormProvider>
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>,
)
