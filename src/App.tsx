import { useState } from 'react'
import './App.css'
import { passwordGenerator as generatePassword }from './App/createPassword'
import copyToClipboard from './App/copyToClipboard'

function App() {
  const [sliderValue, setSliderValue] = useState<string>("20")
  const [finalPassword, setFinalPassword] = useState("") 
  const [isCopied, setCopied] = useState(false)
  
  const copy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const Slider = (value: string) => {
    setSliderValue(value)
    return value
  }

  return (
    <div className="App">
      <div className="card">
        <form className='formWrapper' action="submit">
          <div className="sliderWrapper">
            <label htmlFor="slider">Value: {sliderValue}</label>
            <input aria-label='input' 
            onChange={(e) => Slider(e.currentTarget.value)}
            type="range" name="length" id="slider" min="8" max="32" defaultValue="20" />
          
        <button type='submit' onClick={(e) => {
          e.preventDefault()
          setFinalPassword(
            generatePassword(parseInt(sliderValue)) 
          )
          setCopied(false)}} 
          >
          Generate
        </button>
          </div>
        <div className="">
          <div className='result'>
                result: 
              <span> {finalPassword ? finalPassword : "here"}</span> 
              {finalPassword ? <button type='button' onClick={() => 
                { copyToClipboard(finalPassword)
                  copy()  }
                }>copy</button> : null}
                {isCopied ? <span className='copySpan'>copied</span> : null}
            </div>
        </div>
        </form>
      </div>
      
    </div>
  )
}

export default App
