import './styles/globals.css'
import './styles/Home.css'

import FormComponent from './Components/form'
import Description from './Components/description'


function App() {
  return (
    <main className="main">
      <div className="wrapper">
          <FormComponent />
          <Description />
      </div>
    </main>
  )
}

export default App
