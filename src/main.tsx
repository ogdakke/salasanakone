import { FormProvider } from "@/Components/FormContext"
import { LazyMotion, MotionConfig } from "framer-motion"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

const domAnimation = (await import("@/FramerFeature")).default
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <FormProvider>
          <App />
        </FormProvider>
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>,
)
