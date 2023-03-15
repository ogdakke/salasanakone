// modules
import React, { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react"
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
// hooks
import { stickyState, useStickyState } from "../hooks/stickyState"
// styles
import "../styles/Home.css"
// components 
import CheckIcon from "../assets/icons/checkedIcon"
import { Slider } from "./slider"
import { createCrypto } from "../main";
const Result = React.lazy(() => import("./result"))

type FormType = {
  [option: string]: boolean
}

const createCryptoKey = await createCrypto

const initialFormValues: FormType = {
  uppercase: false,
  randomChars: true,
  numbers: false,
  words: true
}

const initialKeys: string[] = Object.keys(initialFormValues)



export default function FormComponent (): JSX.Element {

  const [sliderValue, setSliderValue] = useStickyState("5", "sliderValue")
  const [finalPassword, setFinalPassword] = useState("") 
   
  const [formValuesTyped, setFormValuesTyped] = stickyState(initialFormValues, "formValues")
  const formValues = formValuesTyped as FormType // explicitly type formValues as FormType
  const setFormValues = setFormValuesTyped as Dispatch<SetStateAction<FormType>> // explicitly type setFormValues as Dispatch<SetStateAction<FormType>>

  const minLengthForChars = 8
  const minLengthForWords = 1
  const maxLengthForChars = 64
  const maxLengthForWords = 12

  
const validate = (sliderValue: string): string => {
  if (formValues.words && parseInt(sliderValue) > maxLengthForWords) {
    setSliderValue(maxLengthForWords)
    return maxLengthForWords.toString()
  } else if (!formValues.words && parseInt(sliderValue) < minLengthForChars) {
    setSliderValue(minLengthForChars)
    return minLengthForChars.toString()
  }
  return sliderValue
}


  useEffect(() => {
    validate(sliderValue)
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
    return setFormValues({ 
      ...formValues, 
      [option]: event as boolean
    })
  }


  const labelForCheckbox = (option: string) => {
    if (option === "uppercase") {
      return "Isot Kirjaimet"
    } else if (option === "randomChars") {
      return "Erikoismerkit"
    } else if (option === "numbers") {
      return `Numerot`
    }
    return "Käytä kokonaisia sanoja"
  }

  const sliderVal = (value: number[]) => {
    validate(setSliderValue(value))
    return value
  }

  return (
    <>
    <form className='form' action="submit" aria-busy="false">
    {initialKeys.map((option, i) => {
      return (
        <div className="inputWrapper" key={option}>
          <Checkbox.Root
            aria-label={labelForCheckbox(option)}
            className="checkboxRoot"
            checked={formValues[option] === true}
            onCheckedChange={(event) => {
              setValuesToForm(option, event)
            }}
            id={option}
            value={option}>
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
        id="slider"
        name="slider"
        aria-label="Salasanan pituus"
        value={[parseInt(validate(sliderValue))]}
        onValueChange={(val) => sliderVal(val)}
        max={formValues.words ? maxLengthForWords : maxLengthForChars}    
        min={formValues.words ? minLengthForWords : minLengthForChars} 
        step={1}
      />

      </div>
      <div className="buttonWrapper">
        <button 
          className="inputButton"
          aria-label="Luo Uusi Salasana"
          type='submit'
          onClick={(e) => {
            e.preventDefault()
            generate()
          }}>
          Luo Uusi Salasana
        </button>
      </div>
    <div className="resultWrapper">
      <p className="resultHelperText">
          Kopioi Salasana napauttamalla:         
      </p>
      <Suspense fallback={
      <div aria-busy="true" className="card"><span className="notCopied loader"></span></div>
      }>
      {/* <div aria-busy="true" className="card"><span className="notCopied">Loading...</span></div> */}
        <Result 
          aria-busy="false"
          aria-label="Salasana, jonka voi kopioida napauttamalla"
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


const copyText = lang.Finnish ? "Kopioi Salasana Klikkaamalla" : "Click to Copy"