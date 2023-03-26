import React, { Suspense } from 'react'
// styles
import './styles/globals.css'
import './styles/App.css'
// components
import Description from './Components/description'
import { Loading } from './Components/ui/loading'
import ReloadPrompt from "./Components/reloadPrompt"
import { DataFunc } from './Api/data'
import { LogoIcon } from './assets/icons/logoIcon'

const FormComponent = React.lazy(() => import("./Components/form"))

function App() {
  return (
    <main className="main" onLoad={e => DataFunc(e)}>
      <div className="wrapper">
        <div className="withIcon" style={{"gap": "1rem"}}>
          <LogoIcon width={40} height={40} />
          <h1>Luo Salasana</h1>
        </div>
        <Suspense fallback={<Loading />}>
          <FormComponent/>
        </Suspense>
          <Description />
          <ReloadPrompt />
      </div>
    </main>
  )
}

export default App
