import { Dispatch, SetStateAction, useEffect, useState } from "react"
import createCryptoKey from "../Api/createCrypto"
import { stickyState, useStickyState } from "./stickyState"
import "../styles/Home.css"
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
import CheckIcon from "../assets/icons/checkedIcon"
import Result from "./result"


type FormType = {
  [option: string]: boolean
}

const initialFormValues: FormType = {
  uppercase: false,
  randomChars: true,
  words: true
}

const initialKeys: string[] = Object.keys(initialFormValues)


export default function FormComponent () {

  const [sliderValue, setSliderValue] = useStickyState("20", "sliderValue")
  // const [uppercase, setUppercase] = useStickyState(false, "useUppercase")
  const [finalPassword, setFinalPassword] = useState("") 
   
  const [formValuesTyped, setFormValuesTyped] = stickyState(initialFormValues, "formValues")
  const formValues = formValuesTyped as FormType // explicitly type formValues as FormType
  const setFormValues = setFormValuesTyped as Dispatch<SetStateAction<FormType>> // explicitly type setFormValues as Dispatch<SetStateAction<FormType>>
  // const [formValues, setFormValues] = useState(initialFormValues)

  const maxLengthForChars = 64
  const maxLengthForWords = 12


  
const validate = (sliderValue: string): string => {
  if (formValues.words && parseInt(sliderValue) > maxLengthForWords) {
    return maxLengthForWords.toString()
  }
  return sliderValue
}


  useEffect(() => {
    generate()
  }, [formValues, sliderValue])    

  function generate() {
    
    createCryptoKey(validate(sliderValue), formValues)
    .then((response) =>
      setFinalPassword(response)) 
    // setCopied(false)
  }
  
  const setValuesToForm = (option: string, event: Checkbox.CheckedState) => {
    setFormValues({ 
      ...formValues, 
      [option]: event as boolean
    })
  }



  const Slider = (value: string) => {
    setSliderValue(value)
    return value
  }

  return (
    <>
    <form className='form' action="submit">
    {initialKeys.map((option) => {
      return (
        <div className="inputWrapper" key={option}>

          <Checkbox.Root
            className="checkboxRoot"
            checked={formValues[option] === true}
            onCheckedChange={(event) => {
              setValuesToForm(option, event)
            } }
            id={option}
            value={option}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <Label.Root
            className="LabelRoot"
            htmlFor={option}>
            {option}

          </Label.Root>
        </div>
      )
    })}
    
    <div className="sliderWrapper">
      <Label.Root className="LabelRoot" htmlFor="slider">
        {formValues.words 
        ? `Pituus: ${validate(sliderValue)} Sanaa`
        : `Pituus: ${validate(sliderValue)} Merkkiä`}
        </Label.Root>

        {/* <SliderComponent/> */}


      <input 
        className="sliderRoot"
        aria-label='input' 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => Slider(e.currentTarget.value)}
        id="slider" min={formValues.words ? "1" : "3"} 
        max={formValues.words ? maxLengthForWords : maxLengthForChars} 
        value={sliderValue >= maxLengthForWords && formValues.words ? maxLengthForWords : sliderValue}
        type="range" name="length" 
         />
      </div>
      <div className="buttonWrapper">
        <button 
          className="inputButton"
          type='submit'
          onClick={(e) => {
            e.preventDefault()
            generate()
          }}>
          Luo Uusi Salasana
        </button>
      </div>

      <Result 
        finalPassword={finalPassword}
        copyText={copyText}
      />
  
  </form>
  </>
  )
}


const lang = {
  "Finnish": true,
  "English": false
}


const copyText = lang.Finnish ? "Kopioi Klikkaamalla." : "Click to Copy"