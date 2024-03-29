import { Header } from "@/Components/Header"
import { Description } from "@/Components/description"
import { ErrorComponent } from "@/Components/errorComponent"
import { ReloadPrompt } from "@/Components/reloadPrompt"
import { Credits } from "@/Components/ui/credits"
import { Loading } from "@/Components/ui/loading"
import { initDB } from "@/services/database/db"
import "@/styles/App.css"
import "@/styles/globals.css"
import React, { Suspense } from "react"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"

const FormComponent = React.lazy(async () => await import("@/Components/form"))

await initDB()

function App() {
  return (
    <>
      <main className="main">
        <div className="wrapper">
          <Header />
          <Suspense fallback={<FormComponentLoader />}>
            <ErrorBoundary fallbackRender={FormErrorComponent}>
              <FormComponent />
            </ErrorBoundary>
          </Suspense>
          <Description />
        </div>
        <Credits />
      </main>
      <ReloadPrompt />
    </>
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
          <SmallScreenIslandLoader />
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
  <div className="IslandLoadingStateWrapper">
    <div className="IslandLoadingState">
      <Loading width="55%" height="2.125rem" radius="4rem" />
      <Loading width="2.125rem" height="2.125rem" radius="4rem" />
    </div>
  </div>
)

const SmallScreenIslandLoader = () => (
  <div className="IslandLoadingStateWrapper">
    <div className="IslandLoadingState">
      <Loading width="100%" height="3.375rem" radius="4rem" />
      <Loading
        className="IslandSettingsButtonLoader"
        width="3.375rem"
        height="3.375rem"
        radius="4rem"
      />
    </div>
  </div>
)

export default App
