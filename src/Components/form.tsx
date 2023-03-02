import React, { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react"
import { stickyState, useStickyState } from "./stickyState"
import "../styles/Home.css"
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
import CheckIcon from "../assets/icons/checkedIcon"
import { Slider } from "./slider"
const Result = React.lazy(() => import("./result"))

const createCrypto = import("../Api/createCrypto").then((res) => res.default)
type FormType = {
  [option: string]: boolean
}

const createCryptoKey = await createCrypto
const initialFormValues: FormType = {
  uppercase: false,
  randomChars: true,
  words: true
}

const initialKeys: string[] = Object.keys(initialFormValues)



export default function FormComponent () {

  const [sliderValue, setSliderValue] = useStickyState("5", "sliderValue")
  const [finalPassword, setFinalPassword] = useState("") 
   
  const [formValuesTyped, setFormValuesTyped] = stickyState(initialFormValues, "formValues")
  const formValues = formValuesTyped as FormType // explicitly type formValues as FormType
  const setFormValues = setFormValuesTyped as Dispatch<SetStateAction<FormType>> // explicitly type setFormValues as Dispatch<SetStateAction<FormType>>

  const maxLengthForChars = 64
  const maxLengthForWords = 12


  
const validate = (sliderValue: string): string => {
  if (formValues.words && parseInt(sliderValue) > maxLengthForWords) {
    setSliderValue(maxLengthForWords)
    return maxLengthForWords.toString()
  }
  return sliderValue
}


  useEffect(() => {    
    generate()
  }, [formValues, sliderValue])    

  const generate = async () => {
    await createCryptoKey(sliderValue, formValues).then((res) => {
      setFinalPassword(res)
    })
  }

  // function generate() {
  //   await createCryptoKey(validate(sliderValue), formValues)
  //   .then((response) =>
  //     setFinalPassword(response)) 
  //   // setCopied(false)
    
  // }
  
  const setValuesToForm = (option: string, event: Checkbox.CheckedState) => {
    setFormValues({ 
      ...formValues, 
      [option]: event as boolean
    })
  }


  const labelForCheckbox = (option: string) => {
    if (option === "uppercase") {
      return "Isot Kirjaimet"
    } else if (option === "randomChars") {
      return "Erikoismerkit"
    }
    return "Käytä kokonaisia sanoja"
  }

  const sliderVal = (value: number[]) => {
    validate(setSliderValue(value))
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
            {labelForCheckbox(option)}

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

      <Slider 
        value={[parseInt(validate(sliderValue))]}
        onValueChange={(val) => sliderVal(val)}
        max={formValues.words ? maxLengthForWords : maxLengthForChars}    
        min={formValues.words ? 1 : 3} 
        step={1}
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
    <div className="resultWrapper">
      <p className="result">
          Kopioi Salasana napauttamalla:         
      </p>
      <Suspense fallback={<div className="card">Loading...</div>}>
        <Result 
          finalPassword={finalPassword}
          copyText={copyText}
          />          
      </Suspense>
    </div>

  
  </form>
  </>
  )
}


const lang = {
  "Finnish": true,
  "English": false
}


const copyText = lang.Finnish ? "Kopioi Klikkaamalla." : "Click to Copy"