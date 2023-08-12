import React, { Suspense } from "react"

// styles
import "./styles/App.css"
import "./styles/Globals.css"

import { ErrorBoundary } from "react-error-boundary"

import { LogoIcon } from "./assets/icons/logoIcon"
// components
import Description from "./components/description"
import { ErrorComponent } from "./components/errorComponent"
import { Feedback } from "./components/feedback"
import ReloadPrompt from "./components/reloadPrompt"
import { Credits } from "./components/ui/credits"
import { Loading } from "./components/ui/loading"

const FormComponent = React.lazy(async () => await import("./components/form"))

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
            <>
              <Loading height={isSmallScreen ? "394.375px" : "309px"} />
              {!isSmallScreen ? <Loading height={"84.1875px"} /> : null}
            </>
          }
        >
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => {
              return (
                <>
                  <ErrorComponent error={error as Error} resetErrorBoundary={resetErrorBoundary} />
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
