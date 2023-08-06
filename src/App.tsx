import React, { Suspense } from "react"

// styles
import "./styles/globals.css"
import "./styles/App.css"

import { ErrorBoundary } from "react-error-boundary"

import { LogoIcon } from "./assets/icons/logoIcon"
// components
import Description from "./Components/description"
import { ErrorComponent } from "./Components/errorComponent"
import { Feedback } from "./Components/feedback"
import ReloadPrompt from "./Components/reloadPrompt"
import { Credits } from "./Components/ui/credits"
import { Loading } from "./Components/ui/loading"
import { motion } from "framer-motion"

const FormComponent = React.lazy(async () => await import("./Components/form"))

const isSmallScreen = screen.width < 700

function App() {
  return (
    <main className="main">
      <div className="wrapper">
        <div className="flex-center" style={{ gap: "1rem" }}>
          <LogoIcon width={40} height={40} />
          <h1>Salasanakone</h1>
        </div>
        <Suspense
          fallback={
            <div className="relative">
              <Loading height={isSmallScreen ? "394.375px" : "309px"} />
              <div style={{ height: "1.5rem" }}> </div>
              <Loading
                height={"84.1875px"}
                className={isSmallScreen ? `'absolute bottom-0'` : ``}
              />
            </div>
          }
        >
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => {
              return (
                <>
                  <ErrorComponent error={error} resetErrorBoundary={resetErrorBoundary} />
                  <button type="button" className="inputButton" onClick={resetErrorBoundary}>
                    Yritä uudelleen
                  </button>
                </>
              )
            }}
          >
            <FormComponent />
          </ErrorBoundary>
        </Suspense>
        <Description />
        <Feedback />
        <Credits />
        <ReloadPrompt />
      </div>
    </main>
  )
}

export default App
