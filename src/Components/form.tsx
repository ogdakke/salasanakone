import { defaultFormValues, maxLengthForWords, minLengthForChars } from "@/../config"
import { InputField, Island, SliderComponent } from "@/Components"
import { Loading } from "@/Components/ui"
import { useDispatch, useSelector } from "@/common/hooks"
import { setFormField, setSliderValue } from "@/features/passphrase-form/passphrase-form.slice"
import { ApiSalaCall, IndexableFormValues, InputLabel } from "@/models"
import { getPassphrase } from "@/services/get-passphrase"
import "@/styles/Form.css"
import "@/styles/ui/Checkbox.css"
import React, { Suspense, useCallback, useEffect, useState } from "react"
const Result = React.lazy(async () => await import("@/Components/result"))

const initialInputKeys = Object.entries(defaultFormValues)

export default function FormComponent(): React.ReactNode {
  const [finalPassword, setFinalPassword] = useState<string>()
  const [isDisabled, setDisabled] = useState(false)
  const [isError, setError] = useState(false)
  const [isLoading, setLoading] = useState(false)

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

  const generate = useCallback(async () => {
    inputFieldShouldDisable() ? setDisabled(true) : setDisabled(false)
    try {
      const apiParams: ApiSalaCall = {
        lang: "fi",
        passLength: sliderValue,
        inputValues: formValues,
      }
      const fetchedPassphrase = await getPassphrase(apiParams).catch(console.error)
      setFinalPassword(fetchedPassphrase ? fetchedPassphrase : "Virhe haettaessa salasanaa")
    } catch (err) {
      console.error(err)
    }
  }, [formValues, sliderValue])

  useEffect(() => {
    generate().catch(console.error)
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

  // useEffect(() => {
  //   setLoading(true)
  //   const fetchData = async () => {
  //     try {
  //       const apiParams: ApiSalaCall = {
  //         lang: "fi",
  //         passLength: sliderValue,
  //         inputValues: formValues,
  //       }
  //       const fetchedPassphrase = await getPassphrase(apiParams).catch(console.error)
  //       setFinalPassword(fetchedPassphrase ? fetchedPassphrase : "Virhe haettaessa salasanaa")
  //     } catch (err) {
  //       setError(true)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchData().catch(console.error)
  // }, [sliderValue, formValues])

  return (
    <>
      <form className="form fadeIn" action="submit" aria-busy="false" style={{ opacity: "1" }}>
        <Suspense fallback={<Loading height="71px" />}>
          <Result
            aria-busy="false"
            aria-label="Salasana, jonka voi kopioida napauttamalla"
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
        <Island generate={generate} finalPassword={finalPassword} />
      </div>
    </>
  )
}
