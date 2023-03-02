import React, { Suspense } from 'react'
import Description from './Components/description'

import './styles/globals.css'
import './styles/Home.css'

import { Loading } from './Components/loading'
const FormComponent = React.lazy(() => import("./Components/form"))

function App() {
  return (
    <main className="main">
      <div className="wrapper">
        <Suspense fallback={<Loading />}>
          <FormComponent />
          {/* <Loading /> */}
        </Suspense>
          <Description />
      </div>
    </main>
  )
}

export default App
