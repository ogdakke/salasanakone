import { InputField, SimpleIsland, SliderComponent } from "@/Components"
import { FormContext, FormDispatchContext } from "@/Components/providers"
import { t } from "@/common/utils"
import { defaultFormValues } from "@/config"
import { IndexableFormValues, InputLabel } from "@/models"
import { FormActionKind } from "@/services/reducers/formReducer"
import "@/styles/Form.css"
import "@/styles/ui/Checkbox.css"
import React, { useCallback, useContext, useEffect } from "react"

const Result = React.lazy(async () => await import("@/Components/result"))
const initialInputKeys = Object.entries(defaultFormValues)

export default function FormComponent(): React.ReactNode {
  const { formState, generate, validate } = useContext(FormContext)
  const { dispatch } = useContext(FormDispatchContext)
  const { formValues, sliderValue } = formState

  if (!validate) {
    throw new Error("No validate found from context")
  }

  const { SET_FORM_FIELD } = FormActionKind

  const valuesToForm = useCallback(
    (option: InputLabel, event: string | boolean, value: "selected" | "value") => {
      const updatedValue: IndexableFormValues = formValues
      validate(sliderValue, formState)
      if (value === "selected" && typeof event === "boolean") {
        updatedValue[option] = { ...updatedValue[option], selected: event }

        dispatch({
          type: SET_FORM_FIELD,
          payload: {
            field: option,
            selected: updatedValue[option].selected,
          },
        })
      } else if (typeof event === "string") {
        updatedValue[option] = { ...updatedValue[option], value: event }

        dispatch({
          type: SET_FORM_FIELD,
          payload: {
            field: option,
            value: updatedValue[option].value,
          },
        })
      }
    },
    [],
  )

  useEffect(() => {
    const gen = async () => {
      await generate()
    }
    gen().catch(console.error)
    return () => void gen()
  }, [generate, sliderValue, validate])

  return (
    <>
      <form className="form blurFadeIn" action="submit" aria-busy="false" style={{ opacity: "1" }}>
        <Result aria-busy="false" aria-label={t("resultHelperLabel")} />
        <div className="inputGrid">
          {initialInputKeys.map(([item, entry]) => (
            <InputField
              key={item}
              option={item as InputLabel}
              values={entry}
              valuesToForm={valuesToForm}
            />
          ))}
          <SliderComponent />
        </div>
      </form>
      <div className="IslandWrapper blurFadeIn">
        <SimpleIsland />
      </div>
    </>
  )
}

