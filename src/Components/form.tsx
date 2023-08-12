import { motion } from "framer-motion"
import React, { Suspense, useCallback, useEffect, useState } from "react"
import {
  inputFieldMaxLength,
  inputValues,
  labelForCheckbox,
  maxLengthForChars,
  maxLengthForWords,
  minLengthForChars,
  minLengthForWords,
} from "../../config"
import { usePersistedState } from "../hooks/usePersistedState"
import { IndexableInputValue, InputLabel } from "../models"
import { createCryptoKey } from "../services/createCrypto"
import "../styles/Form.css"
import "../styles/ui/Checkbox.css"
import { correctType } from "../utils/helpers"
import { validateLength } from "./indicator"
import { Island } from "./island"
import { Checkbox } from "./ui/checkbox"
import { InputComponent } from "./ui/input"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radioGroup"
import { Slider } from "./ui/slider"
const Result = React.lazy(async () => await import("./result"))

const lang = {
  Finnish: true,
  English: false,
}

const initialInputKeys = Object.entries(inputValues)

export function generatePassword(formValues: IndexableInputValue, sliderValue: number) {
  return createCryptoKey(sliderValue.toString(), formValues)
}

export default function FormComponent(): React.ReactNode {
  const [finalPassword, setFinalPassword] = useState("")
  const [formValuesTyped, setFormValuesTyped] = usePersistedState("formValues", inputValues)
  const [sliderValue, setSliderValue] = usePersistedState("sliderValue", 4)
  const formValues = formValuesTyped
  // as FormType // explicitly type formValues as FormType
  const setFormValues = setFormValuesTyped
  // as Dispatch<SetStateAction<FormType>> // explicitly type setFormValues as Dispatch<SetStateAction<FormType>>
  const [isDisabled, setDisabled] = useState(false)

  const validate = useCallback(
    (sliderValue: number): number => {
      const { selected } = formValues.words
      if (
        selected &&
        (sliderValue > maxLengthForWords || sliderValue < 1 || !correctType(sliderValue, "number")) // should return false
      ) {
        setSliderValue(maxLengthForWords)
        return maxLengthForWords
      } else if (!selected && sliderValue < minLengthForChars) {
        setSliderValue(minLengthForChars)
        return minLengthForChars
      }
      return sliderValue
    },
    [formValues, setSliderValue],
  )

  const generate = useCallback(() => {
    inputFieldShouldDisable() ? setDisabled(true) : setDisabled(false)
    try {
      const setPassword = () => generatePassword(formValues, sliderValue)
      setFinalPassword(setPassword())
    } catch (err) {
      console.error(err)
      throw new Error("Error setting password")
    }
  }, [formValues, sliderValue])

  useEffect(() => {
    validate(sliderValue)
    generate()
  }, [generate, sliderValue, validate])

  const valuesToForm = useCallback(
    (option: InputLabel, event: unknown, value: "selected" | "value") => {
      setFormValues((prev) => {
        const updatedValues = { ...prev }

        if (value === "selected" && typeof event === "boolean") {
          updatedValues[option] = { ...updatedValues[option], selected: event }
        } else if (typeof event === "string") {
          updatedValues[option] = { ...updatedValues[option], value: event }
        }
        return updatedValues
      })
    },
    [setFormValues],
  )

  const sliderVal = (value: number): number => {
    setSliderValue(validate(value))
    return value
  }

  const inputFieldShouldDisable = () => {
    return formValues.words.selected && sliderValue < 2
  }

  return (
    <>
      <form className="form fadeIn" action="submit" aria-busy="false" style={{ opacity: "1" }}>
        <div className="resultWrapper">
          <p className="resultHelperText">
            Kopioi Salasana napauttamalla
            {/* tai paina<kbd>C</kbd> */}
          </p>
          <Suspense
            fallback={
              <div aria-busy="true" className="card">
                <span className="notCopied">Ladataan...</span>
              </div>
            }
          >
            <Result
              aria-busy="false"
              aria-label="Salasana, jonka voi kopioida napauttamalla"
              finalPassword={finalPassword}
              copyText={copyText}
            />
          </Suspense>
        </div>

        <div className="inputGrid">
          {initialInputKeys.map(([item, entry]) => {
            const option = item as InputLabel
            const values = entry
            // formValues[option].selected
            if (values.inputType === "checkbox") {
              return (
                <div
                  key={option}
                  className="checkboxParent flex-center"
                  style={{ gridArea: `${option}` }}
                >
                  <Checkbox
                    aria-label={labelForCheckbox(option)}
                    checked={formValues[option].selected}
                    onCheckedChange={(event) => {
                      values.selected = !values.selected
                      valuesToForm(option, event, "selected")
                    }}
                    id={option}
                    value={values.selected.toString()}
                  ></Checkbox>
                  <Label title={values.info} htmlFor={option}>
                    {labelForCheckbox(option)}
                  </Label>
                </div>
              )
            } else if (values.inputType === "radio") {
              return (
                <div key={option} className="flex-center radio">
                  <RadioGroup
                    defaultValue={formValues[option].selected.toString()}
                    onValueChange={(event) => {
                      values.selected = !values.selected
                      const isBool = event === "true" ? true : false
                      valuesToForm(option, isBool, "selected")
                    }}
                  >
                    <div className="flex-center">
                      <RadioGroupItem value="true" id="r1" key="r1" />
                      <Label htmlFor="r1">Käytä sanoja</Label>
                    </div>
                    <div className="flex-center">
                      <RadioGroupItem value="false" id="r2" key="r2" />
                      <Label htmlFor="r2">Käytä merkkejä</Label>
                    </div>
                  </RadioGroup>
                </div>
              )
            } else {
              // if values.inputType === "input"
              return (
                <div key={option} className="textInputBox">
                  {formValues.words.selected ? (
                    <div className="fadeIn labelOnTop">
                      <Label className="flex-bottom" title={values.info} htmlFor={option}>
                        {labelForCheckbox(option)}
                        {isDisabled ? (
                          <span className="resultHelperText">Lisää sanoja</span>
                        ) : (
                          <span></span>
                        )}
                      </Label>
                      <InputComponent
                        disabled={isDisabled}
                        maxLength={inputFieldMaxLength}
                        defaultValue={formValues[option].value}
                        placeholder={inputPlaceholder}
                        onChange={(event) => {
                          valuesToForm(
                            option,
                            validateLength(event.target.value, inputFieldMaxLength),
                            "value",
                          )
                        }}
                      />
                    </div>
                  ) : (
                    <div key={option} className="flex-center fadeIn">
                      <Checkbox
                        aria-label={labelForCheckbox(option)}
                        className="checkboxRoot"
                        checked={formValues[option].selected}
                        onCheckedChange={(event) => {
                          values.selected = !values.selected
                          valuesToForm(option, event, "selected")
                        }}
                        id={option}
                        value={values.selected.toString()}
                      ></Checkbox>
                      <Label htmlFor={option}>Erikoismerkit</Label>
                    </div>
                  )}
                </div>
              )
            }
          })}
          <div className="sliderWrapper">
            <Label htmlFor="slider">
              {formValues.words.selected
                ? `Pituus: ${sliderValue} Sanaa`
                : `Pituus: ${sliderValue} Merkkiä`}
            </Label>
            <Slider
              id="slider"
              name="slider"
              aria-label="Salasanan pituus"
              value={[validate(sliderValue)]}
              onValueChange={(val) => sliderVal(val[0])} // makes sure val is not a "number[]"
              max={formValues.words.selected ? maxLengthForWords : maxLengthForChars}
              min={formValues.words.selected ? minLengthForWords : minLengthForChars}
              step={1}
            >
              <motion.span
                initial={{ scale: 1 }}
                whileTap={{
                  scale: 0.9,
                }}
              ></motion.span>
            </Slider>
          </div>
        </div>
      </form>
      <div className="IslandWrapper">
        <Island
          generate={generate}
          finalPassword={finalPassword}
          formValues={formValues}
          sliderValue={sliderValue}
        />
      </div>
    </>
  )
}

const copyText = lang.Finnish ? "Kopioi Salasana Klikkaamalla" : "Click to Copy"
const inputPlaceholder = 'Esim. "-" tai "?" tai "3!"'
