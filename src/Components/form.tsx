import { defaultFormValues, maxLengthForWords, minLengthForChars } from "@/../config"
import { InputField, SimpleIsland, SliderComponent } from "@/Components"
import { Loading } from "@/Components/ui"
import { useDispatch, useSelector } from "@/common/hooks"
import { t } from "@/common/utils"
import { setFormField, setSliderValue } from "@/features/passphrase-form/passphrase-form.slice"
import { IndexableFormValues, InputLabel } from "@/models"
import { createCryptoKey } from "@/services/createCrypto"
import "@/styles/Form.css"
import "@/styles/ui/Checkbox.css"
import React, { Suspense, createContext, useCallback, useEffect, useState } from "react"
const Result = React.lazy(async () => await import("@/Components/result"))

const initialInputKeys = Object.entries(defaultFormValues)

export function generatePassword(formValues: IndexableFormValues, sliderValue: number) {
  return createCryptoKey(sliderValue.toString(), formValues)
}

type FormContextProps = {
  password?: string
  generate: () => void
}

export const FormContext = createContext<FormContextProps | undefined>(undefined)

export default function FormComponent(): React.ReactNode {
  const [finalPassword, setFinalPassword] = useState<string>()
  const [isDisabled, setDisabled] = useState(false)

  const dispatch = useDispatch()
  const sliderValue = useSelector((state) => state.passphraseForm.sliderValue)
  const formValues = useSelector((state) => state.passphraseForm.formValues)

  const validate = useCallback(
    (sliderValue: number): number => {
      const { selected } = formValues.words

      if (
        selected &&
        (sliderValue > maxLengthForWords || sliderValue < 1) // should return false
      ) {
        dispatch(setSliderValue(maxLengthForWords))
        return maxLengthForWords
      } else if (!selected && sliderValue < minLengthForChars) {
        dispatch(setSliderValue(minLengthForChars))
        return minLengthForChars
      }
      return sliderValue
    },
    [formValues],
  )

  const generate = useCallback(() => {
    inputFieldShouldDisable() ? setDisabled(true) : setDisabled(false)
    try {
      const setPassword = () => generatePassword(formValues, validate(sliderValue))
      setFinalPassword(setPassword())
    } catch (err) {
      console.error(err)
    }
  }, [formValues, sliderValue])

  useEffect(() => {
    generate()
  }, [generate, sliderValue, validate])

  const valuesToForm = useCallback(
    (option: InputLabel, event: string | boolean, value: "selected" | "value") => {
      const updatedValue: IndexableFormValues = { ...formValues }
      validate(sliderValue)
      if (value === "selected" && typeof event === "boolean") {
        updatedValue[option] = { ...updatedValue[option], selected: event }
        dispatch(setFormField({ field: option, value: updatedValue[option] }))
      } else if (typeof event === "string") {
        updatedValue[option] = { ...updatedValue[option], value: event }
        dispatch(setFormField({ field: option, value: updatedValue[option] }))
      }
    },
    [dispatch],
  )

  const inputFieldShouldDisable = () => {
    return formValues.words.selected && sliderValue < 2
  }

  return (
    <FormContext.Provider value={{ password: finalPassword, generate }}>
      <form className="form fadeIn" action="submit" aria-busy="false" style={{ opacity: "1" }}>
        <Suspense fallback={<Loading height="71px" />}>
          <Result
            aria-busy="false"
            aria-label={t("resultHelperLabel")}
            finalPassword={finalPassword}
          />
        </Suspense>
        <div className="inputGrid">
          {initialInputKeys.map(([item, entry]) => (
            <InputField
              key={item}
              option={item as InputLabel}
              values={entry}
              isDisabled={isDisabled}
              valuesToForm={valuesToForm}
            />
          ))}
          <SliderComponent validate={validate} />
        </div>
      </form>
      <div className="IslandWrapper">
        <SimpleIsland />
      </div>
    </FormContext.Provider>
  )
}

