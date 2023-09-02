import { defaultFormValues, maxLengthForWords, minLengthForChars } from "@/../config"
import { InputField, Island, SliderComponent } from "@/Components"
import { Loading } from "@/Components/ui"
import { setFormField, setSliderValue } from "@/features/passphrase-form/passphrase-form.slice"
import { useDispatch, useSelector } from "@/hooks"
import { IndexableFormValues, InputLabel } from "@/models"
import { createCryptoKey } from "@/services/createCrypto"
import "@/styles/Form.css"
import "@/styles/ui/Checkbox.css"
import { t } from "@/utils/getLanguage"
import React, { Suspense, useCallback, useEffect, useState } from "react"
const Result = React.lazy(async () => await import("@/Components/result"))

const initialInputKeys = Object.entries(defaultFormValues)

export function generatePassword(formValues: IndexableFormValues, sliderValue: number) {
  return createCryptoKey(sliderValue.toString(), formValues)
}

export default function FormComponent(): React.ReactNode {
  const [finalPassword, setFinalPassword] = useState<string>()
  // const [formValues, setFormValues] = usePersistedState("formValues", defaultFormValues)
  const [isDisabled, setDisabled] = useState(false)

  const dispatch = useDispatch()
  const sliderValue = useSelector((state) => state.passphraseForm.sliderValue)
  const formValues = useSelector((state) => state.passphraseForm.formValues)

  const validate = (sliderValue: number): number => {
    const { selected } = formValues.words
    if (
      selected &&
      (sliderValue > maxLengthForWords || sliderValue < 1) // should return false
    ) {
      // dispatch(setSliderValue(maxLengthForWords))
      return maxLengthForWords
    } else if (!selected && sliderValue < minLengthForChars) {
      // dispatch(setSliderValue(minLengthForChars))
      return minLengthForChars
    }
    return sliderValue
  }

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
    (option: InputLabel, event: string | boolean, value: "selected" | "value") => {
      const updatedValue: IndexableFormValues = { ...formValues }
      if (value === "selected" && typeof event === "boolean") {
        updatedValue[option] = { ...defaultFormValues[option], selected: event }
      } else if (typeof event === "string") {
        updatedValue[option] = { ...defaultFormValues[option], value: event }
      }

      dispatch(setFormField({ field: option, value: updatedValue[option] }))
    },
    [dispatch],
  )

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

        <button
          className="inputButton"
          type="button"
          onClick={() => dispatch(setSliderValue(sliderValue + 1))}
        >
          set
        </button>
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
