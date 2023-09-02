import {
  inputValues,
  maxLengthForChars,
  maxLengthForWords,
  minLengthForChars,
  minLengthForWords,
} from "@/../config"
import { InputField, Island } from "@/Components"
import { Label, Loading, Slider } from "@/Components/ui"
import { usePersistedState } from "@/hooks/usePersistedState"
import { IndexableInputValue, InputLabel } from "@/models"
import { createCryptoKey } from "@/services/createCrypto"
import "@/styles/Form.css"
import "@/styles/ui/Checkbox.css"
import { t } from "@/utils/getLanguage"
import { correctType } from "@/utils/helpers"
import { motion } from "framer-motion"
import React, { Suspense, useCallback, useEffect, useState } from "react"
const Result = React.lazy(async () => await import("@/Components/result"))

const initialInputKeys = Object.entries(inputValues)

export function generatePassword(formValues: IndexableInputValue, sliderValue: number) {
  return createCryptoKey(sliderValue.toString(), formValues)
}

export default function FormComponent(): React.ReactNode {
  const [finalPassword, setFinalPassword] = useState<string>()
  const [formValues, setFormValues] = usePersistedState("formValues", inputValues)
  const [sliderValue, setSliderValue] = usePersistedState("sliderValue", 4)
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
      throw new Error(`error setting password`)
    }
  }, [formValues, sliderValue])

  useEffect(() => {
    validate(sliderValue)
    generate()
  }, [generate, sliderValue, validate])

  const valuesToForm = useCallback(
    (option: InputLabel, event: unknown, value: "selected" | "value") => {
      console.log(option, event, value)

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
        <Suspense fallback={<Loading height="71px" />}>
          <Result
            aria-busy="false"
            aria-label="Salasana, jonka voi kopioida napauttamalla"
            finalPassword={finalPassword}
            copyText={t("clickToCopy")}
          />
        </Suspense>

        <div className="inputGrid">
          {initialInputKeys.map(([item, entry]) => (
            <InputField
              key={item}
              option={item as InputLabel}
              values={entry}
              formValues={formValues}
              isDisabled={isDisabled}
              valuesToForm={valuesToForm}
            />
          ))}
          <div className="sliderWrapper">
            <Label htmlFor="slider">
              {formValues.words.selected
                ? t("lengthOfPassPhrase", {
                    passLength: sliderValue.toString(),
                  })
                : t("lengthOfPassWord", {
                    passLength: sliderValue.toString(),
                  })}
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
                whileFocus={{
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
