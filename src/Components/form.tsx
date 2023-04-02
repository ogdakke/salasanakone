// modules
import React, { Suspense, useCallback, useEffect, useState } from "react"
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
// hooks
import { usePersistedState } from "../hooks/usePersistedState"
// styles
import "../styles/Home.css"
// components 
import { Slider } from "./ui/slider"
import { createCrypto } from "../main";
import { StrengthIndicator } from "./indicator";
import  {InputComponent } from "./ui/input"
const Result = React.lazy(() => import("./result"))
// Icons
import { Check, Refresh } from 'iconoir-react';


// export type FormType = {
//   [option: string]: boolean
// }
const createCryptoKey = await createCrypto

const initialFormValues = {
  uppercase: false,
  randomChars: true,
  numbers: true,
  words: true
}

type InputType = "checkbox" | "input" | "radio";
// type optionType = "passphrase" | "uppercase" | "numbers" | "words" | "randomChars" | string

export interface InputValue {
  [key: string]: unknown; // index signature
  inputType: InputType;
  value: string;
  selected: boolean;
  info: string;
}

export interface InputValues {
  [key: string]: InputValue;
}

const inputValues: InputValues = {
  passphrase: {
    inputType: "checkbox",
    value: "",
    selected: true,
    info: "Salalause on välimerkillä erotettu sanajono."
  },
  uppercase: {
    inputType: "checkbox",
    value: "",
    selected:false,
    info: `Sisältääkö Salasana isoja kirjaimia.` 
  },
  numbers:{
    inputType: "checkbox",
    value: "",
    selected: true,
    info: "Sisältääkö Salasana numeroita"
  },
  words: {
    inputType: "checkbox",
    value: "",
    selected: true,
    info: "Luodaanko salasana sanoista?"
  },
  randomChars:{
    inputType: "input",
    value: "",
    selected: true,
    info: "Välimerkki, joka yhdistää sanat."
  },
} 

const lang = {
  "Finnish": true,
  "English": false
}


// const initialKeys: string[] = Object.keys(initialFormValues)
const initialInputKeys = Object.entries(inputValues)


const correctType = (arg: unknown, desiredType: unknown): boolean => {
  const isType = typeof(arg)
  if (isType === desiredType) {
    // console.log("Type does match", isType, " is ", desiredType);
    return true
  } else {
    console.error("Type does not match", isType, " is not ", desiredType);
    return false
  }
}



export default function FormComponent() {
  
  const [finalPassword, setFinalPassword] = useState("") 
  const [formValuesTyped, setFormValuesTyped] = usePersistedState("formValues", inputValues)
  const [sliderValue, setSliderValue] = usePersistedState("sliderValue", 4)
  const formValues = formValuesTyped 
  // as FormType // explicitly type formValues as FormType
  const setFormValues = setFormValuesTyped
  // as Dispatch<SetStateAction<FormType>> // explicitly type setFormValues as Dispatch<SetStateAction<FormType>>
  
  const minLengthForChars = 4
  const minLengthForWords = 1
  const maxLengthForChars = 64
  const maxLengthForWords = 12

    
const validate = useCallback((sliderValue: number): number => {
  if (
    formValues.words.selected
    && sliderValue > maxLengthForWords
    || sliderValue < 1
    || !correctType(sliderValue, "number") //should return false
    ) {
    setSliderValue(maxLengthForWords)
    return maxLengthForWords
  } else if (!formValues.words.selected && sliderValue < minLengthForChars) {
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
  
  const valuesToForm = (option: string, event: any, value: string) => {    
    return setFormValues((formValues) => { 
      const updatedFormValues = {...formValues};
      if (value === "selected") {
        const updatedFormValue = { ...updatedFormValues[option], selected: event };
        updatedFormValues[option] = updatedFormValue;
      } else {
        const updatedFormValue = { ...updatedFormValues[option], value: event};
        updatedFormValues[option] = updatedFormValue;
      }
      return updatedFormValues
    })
  }


  const labelForCheckbox = (option: string) => {
    if (option === "uppercase") {
      return "Isot Kirjaimet"
    } else if (option === "randomChars") {
      return "Välimerkit"
    } else if (option === "numbers") {
      return `Numerot`
    } else if (option === "passphrase") {
      return `Salalause`
    }
    return "Käytä sanoja"
  }

  const sliderVal = (value: number) => {
    setSliderValue(validate(value))
    return value
  }


  return (
    <>
    <form className='form' action="submit" aria-busy="false" style={{"opacity": "1"}}>
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
        </Suspense>
      </div>
    </div>

  <div className="inputGrid">
    {initialInputKeys.map((item) => {
      const option = item[0]
      const values = item[1]
        // formValues[option].selected
        return (
          <div className="inputWrapper" key={option}>
          {values.inputType === "checkbox" || values.inputType === "radio"
          ? <>
            <Checkbox.Root
                aria-label={labelForCheckbox(option)}
                className="checkboxRoot"
                checked={formValues[option].selected === true}
                onCheckedChange={(event) => {
                  values.selected = !values.selected
                  valuesToForm(option, event, "selected");
                } }
                id={option}
                value={values.selected.toString()}
                >
                <Checkbox.Indicator>
                  <Check />
                </Checkbox.Indicator>
              </Checkbox.Root><Label.Root
                className="LabelRoot"
                htmlFor={option}>
                  {labelForCheckbox(option)}
                </Label.Root>
              </>  
          : 
          <div>
            <Label.Root
                htmlFor={option}
                className="LabelRoot">
                {labelForCheckbox(option)}
              </Label.Root>
            <InputComponent
              maxLength={maxLengthForChars}
              defaultValue={formValues[option].value}
              placeholder={inputPlaceholder}
              onChange={(event) => {
                valuesToForm(option, event.target.value, "value");
              }}/>
            </div> 
          }
          </div>
        )
      }
    )}
    <div className="sliderWrapper">
      <Label.Root className="LabelRoot" htmlFor="slider">
        {formValues.words.selected
        ? `Pituus: ${validate(sliderValue)} Sanaa`
        : `Pituus: ${validate(sliderValue)} Merkkiä`}
      </Label.Root>
      <Slider
        id="slider"
        name="slider"
        aria-label="Salasanan pituus"
        value={[validate(sliderValue)]}
        onValueChange={(val) => sliderVal(val[0])} //makes sure val is not a "number[]"
        max={formValues.words.selected ? maxLengthForWords : maxLengthForChars}    
        min={formValues.words.selected ? minLengthForWords : minLengthForChars} 
        step={1}
      />

    </div>
  </div>
    
    
      <div className="buttonWrapper">
        <StrengthIndicator 
          password={finalPassword} sliderValue={sliderValue} formValues={formValues}
          /> 
        <button 
          className="inputButton"
          aria-label="Luo Uusi Salasana"
          type='submit'
          onClick={(e) => {
            e.preventDefault()
            generate()
          }}>
          Uusi Salasana
          <Refresh className="refresh icon spin" width={20} height={20} />
        </button>
      </div>
    
  </form>
  </>
  )
  
}



const copyText = lang.Finnish ? "Kopioi Salasana Klikkaamalla" : "Click to Copy"
const inputPlaceholder = `Esim. "-" tai "?" tai "3!"`