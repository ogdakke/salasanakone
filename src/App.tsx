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
          <div className="description">
            <p></p>
            <a href="https"></a>
          </div>
      </div>
    </main>
  )
}

export default App
