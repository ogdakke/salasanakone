import { useTranslation } from "@/common/utils/getLanguage"
import { InputField, SimpleIsland, SliderComponent } from "@/Components"
import { FormContext, FormDispatchContext } from "@/Components/FormContext"
import { defaultFormValues } from "@/config"
import { InputLabel, InputValue, PassCreationRules } from "@/models"
import { FormActionKind } from "@/services/reducers/formReducer"
import "@/styles/Form.css"
import "@/styles/ui/Checkbox.css"
import React, { useCallback, useContext, useEffect } from "react"

const Result = React.lazy(async () => await import("@/Components/result"))

const initialInputKeys = Object.entries(defaultFormValues)

export default function FormComponent(): React.ReactNode {
  const { t } = useTranslation()
  const { formState, generate, validate } = useContext(FormContext)

  if (!validate) {
    throw new Error("No validate found from context")
  }

  const context = useContext(FormDispatchContext)
  const dispatch = context.dispatch

  const { SET_FORM_FIELD } = FormActionKind

  const { formValues, sliderValue } = formState

  const valuesToForm = useCallback(
    (option: InputLabel, event: string | boolean, value: "selected" | "value") => {
      const updatedValue: PassCreationRules = formValues
      validate(sliderValue, formState)
      if (value === "selected" && typeof event === "boolean") {
        dispatch({
          type: SET_FORM_FIELD,
          payload: {
            field: option,
            selected: event,
          },
        })
      } else if (typeof event === "string") {
        dispatch({
          type: SET_FORM_FIELD,
          payload: {
            field: option,
            value: event,
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
  }, [generate, sliderValue, validate])

  return (
    <>
      <form className="form blurFadeIn" aria-busy="false" style={{ opacity: "1" }}>
        <Result aria-busy="false" aria-label={t("resultHelperLabel")} />
        <div className="inputGrid">
          {initialInputKeys.map(([item, entry]) => {
            if (typeof entry !== "object") return null
            return (
              <InputField
                key={item}
                option={item as InputLabel}
                values={entry as InputValue}
                valuesToForm={valuesToForm}
              />
            )
          })}
          <SliderComponent />
        </div>
      </form>
      <div className="IslandWrapper blurFadeIn">
        <SimpleIsland />
      </div>
    </>
  )
}
