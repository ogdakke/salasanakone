import React, { Suspense } from "react"

import { Description, ReloadPrompt } from "@/Components"
import { ErrorComponent } from "@/Components/errorComponent"
import { Feedback } from "@/Components/feedback"
import { Credits, Loading } from "@/Components/ui"
import { LogoIcon } from "@/assets/icons/logoIcon"
import { t } from "@/common/utils/getLanguage"
import "@/styles/App.css"
import "@/styles/globals.css"
import { ErrorBoundary } from "react-error-boundary"

const FormComponent = React.lazy(async () => await import("./Components/form"))

const isSmallScreen = screen.width < 700

function App() {
  return (
    <main className="main">
      <div className="wrapper">
        <div className="flex-center" style={{ gap: "1rem" }}>
          <LogoIcon width={40} height={40} />
          <h1>{t("salasanakone")}</h1>
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
                    {t("tryAgain")}
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

