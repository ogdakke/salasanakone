import React, { Suspense } from "react"

import { Description, ReloadPrompt } from "@/Components"
import { Header } from "@/Components/Header"
import { ErrorComponent } from "@/Components/errorComponent"
import { Loading } from "@/Components/ui"
import { t } from "@/common/utils"
import "@/styles/App.css"
import "@/styles/globals.css"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
const FormProvider = React.lazy(async () => await import("@/Components/providers/FormProvider"))
const FormComponent = React.lazy(async () => await import("@/Components/form"))

function App() {
  return (
    <main className="main">
      <div className="wrapper">
        <Header />
        <Suspense fallback={<FormComponentLoader />}>
          <FormProvider>
            <ErrorBoundary fallbackRender={FormErrorComponent}>
              <FormComponent />
            </ErrorBoundary>
          </FormProvider>
        </Suspense>
        <Description />
        {/* <Feedback /> */}
        {/* <Credits /> */}
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
      {!isSmallScreen ? null : <span></span>}
      {!isSmallScreen ? <LargeScreenIslandLoader /> : null}
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
        {t("tryAgain")}
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

