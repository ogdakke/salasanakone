// modules
import React, { Dispatch, SetStateAction, Suspense, useCallback, useEffect, useState } from "react"
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
// hooks
import { usePersistedState } from "../hooks/usePersistedState"
// styles
import "../styles/Home.css"
// components 
import { Slider } from "./slider"
import { createCrypto } from "../main";
import { StrengthIndicator } from "./indicator";
const Result = React.lazy(() => import("./result"))
// Icons
import { Check, Refresh } from 'iconoir-react';


export type FormType = {
  [option: string]: boolean
}
const createCryptoKey = await createCrypto

const initialFormValues: FormType = {
  uppercase: false,
  randomChars: true,
  numbers: true,
  words: true
}

const initialKeys: string[] = Object.keys(initialFormValues)


const correctType = (arg: unknown, desiredType: unknown): boolean => {
  const isType = typeof(arg)
  if (isType === desiredType) {
    return true
  } else {
    console.error("Type does not match", isType, " is not ", desiredType);
    return false
  }
}

export default function FormComponent() {
  
  const [finalPassword, setFinalPassword] = useState("") 
  
  const [formValuesTyped, setFormValuesTyped] = usePersistedState("formValues", initialFormValues)
  const [sliderValue, setSliderValue] = usePersistedState("sliderValue", 4)
  const formValues = formValuesTyped as FormType // explicitly type formValues as FormType
  const setFormValues = setFormValuesTyped as Dispatch<SetStateAction<FormType>> // explicitly type setFormValues as Dispatch<SetStateAction<FormType>>
  
  const minLengthForChars = 4
  const minLengthForWords = 1
  const maxLengthForChars = 64
  const maxLengthForWords = 12
    
const validate = useCallback((sliderValue: number): number => {
  if (
    formValues.words 
    && sliderValue > maxLengthForWords
    || sliderValue < 1
    || !correctType(sliderValue, "number") //should return false
    ) {
    setSliderValue(maxLengthForWords)
    return maxLengthForWords
  } else if (!formValues.words && sliderValue < minLengthForChars) {
    setSliderValue(minLengthForChars)
    return minLengthForChars
  }
  return sliderValue
}, [formValues, setSliderValue])

  const generate = useCallback(() => {
    try {
      createCryptoKey(sliderValue.toString(), formValues).then((res) => {
        if (res === undefined) {
          throw console.error("undefined");
        }
        setFinalPassword(res)
      }).catch((error) => {
        throw console.error(error);
      })
    } catch (err) {
      throw console.error(err);
    }
  }, [formValues, sliderValue])

  useEffect(() => {
    validate(sliderValue)
    generate()
  }, [generate, sliderValue, validate])
  
  const valuesToForm = (option: string, event: Checkbox.CheckedState) => {
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

  const sliderVal = (value: number) => {
    setSliderValue(validate(value))
    return value
  }


  return (
    <>
    <form className='form' action="submit" aria-busy="false" style={{"opacity": "1"}}>
    {initialKeys.map((option) => {
      return (
        <div className="inputWrapper" key={option}>
          <Checkbox.Root
            aria-label={labelForCheckbox(option)}
            className="checkboxRoot"
            checked={formValues[option] === true}
            onCheckedChange={(event) => {
              valuesToForm(option, event)
            }}
            id={option}
            value={option}>
            <Checkbox.Indicator>
              <Check />
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
        value={[validate(sliderValue)]}
        onValueChange={(val) => sliderVal(val[0])} //makes sure val is not a "number[]"
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
          <Refresh className="refresh icon spin" width={20} height={20} />
        </button>
      </div>
    <div className="resultWrapper">
      <p className="resultHelperText">
          Kopioi Salasana napauttamalla:         
      </p>
      <div className="resultCard">
        <Suspense fallback={
          <div aria-busy="true" className="card"><span className="notCopied">Loading...</span></div>}>
        {/* <div aria-busy="true" className="card"><span className="notCopied">Loading...</span></div> */}
          <Result     
            aria-busy="false"
            aria-label="Salasana, jonka voi kopioida napauttamalla"
            finalPassword={finalPassword}
            copyText={copyText}/>          
          
          <StrengthIndicator 
            password={finalPassword} sliderValue={sliderValue} formValues={formValues}/> 
        </Suspense>
      </div>
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