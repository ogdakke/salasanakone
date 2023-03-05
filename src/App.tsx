import React, { Suspense } from 'react'
// styles
import './styles/globals.css'
import './styles/App.css'
// components
import Description from './Components/description'
import { Loading } from './Components/loading'
import ReloadPrompt from "./Components/reloadPrompt"

const FormComponent = React.lazy(() => import("./Components/form"))

function App() {
  return (
    <main className="main">
      <div className="wrapper">
        <Suspense fallback={<Loading />}>
          <FormComponent />
        </Suspense>
          <Description />
          <ReloadPrompt />
      </div>
    </main>
  )
}

export default App
