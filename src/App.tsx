import React, { Suspense } from 'react'
// styles
import './styles/globals.css'
import './styles/App.css'
// components
import Description from './Components/description'
import { Loading } from './Components/ui/loading'
import ReloadPrompt from "./Components/reloadPrompt"
import { Feedback } from "./Components/feedback"
import { Credits } from "./Components/ui/credits"
import { LogoIcon } from './assets/icons/logoIcon'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorComponent } from './Components/errorComponent'

const FormComponent = React.lazy(() => import("./Components/form"))

function App() {
  return (
    <main className="main">
      <div className="wrapper">
        <div className="flex-center" style={{"gap": "1rem"}}>
          <LogoIcon width={40} height={40} />
          <h1>Luo Salasana</h1>
        </div>
        <Suspense fallback={<Loading />}>
          <ErrorBoundary fallbackRender={({error, resetErrorBoundary}) => {
            return (
              <>
                <ErrorComponent error={error} resetErrorBoundary={resetErrorBoundary}/>
                <button type='button' className="inputButton" onClick={resetErrorBoundary}>Yritä uudelleen</button>
              </>
            )
          }}>
          <FormComponent/>
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
