import React, { Suspense } from "react"

import { Description, ReloadPrompt } from "@/Components"
import { Header } from "@/Components/Header"
import { ErrorComponent } from "@/Components/errorComponent"
import { PillLoadingState } from "@/Components/island"
import { Credits, Loading } from "@/Components/ui"
import { initDB } from "@/services/database/db"
import "@/styles/App.css"
import "@/styles/globals.css"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"

const FormComponent = React.lazy(async () => await import("@/Components/form"))

await initDB()

function App() {
  return (
    <main className="main">
      <div className="wrapper">
        <Header />
        <Suspense fallback={<FormComponentLoader />}>
          <ErrorBoundary fallbackRender={FormErrorComponent}>
            <FormComponent />
          </ErrorBoundary>
        </Suspense>
        <Description />
        <Credits />
        <ReloadPrompt />
      </div>
    </main>
  )
}

const FormComponentLoader = () => {
  const isSmallScreen = screen.width < 700

  return (
    <>
      <Loading height={"var(--formContainerHeight)"} />
      {!isSmallScreen ? (
        <LargeScreenIslandLoader />
      ) : (
        <div className="flex justify-center">
          <PillLoadingState />
        </div>
      )}
    </>
  )
}

const FormErrorComponent = (props: FallbackProps) => {
  const error = props.error as Error
  const { resetErrorBoundary } = props

  return (
    <>
      <ErrorComponent error={error} resetErrorBoundary={resetErrorBoundary} />
      <button type="button" className="inputButton" onClick={resetErrorBoundary}>
        Reload
      </button>
    </>
  )
}

const LargeScreenIslandLoader = () => (
  <div className="flex justify-center">
    <div className="IslandMain LoadingStateIsland">
      <Loading height="2.5rem" radius="4rem" />
    </div>
  </div>
)

export default App
