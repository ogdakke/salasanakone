import { FormContext, FormDispatchContext } from "@/Components/FormContext"
import {
  maxLengthForChars,
  maxLengthForWords,
  minLengthForChars,
  minLengthForWords,
} from "@/config"

import { Label, Slider } from "@/Components/ui"
import { useTranslation } from "@/common/utils/getLanguage"
import { FormActionKind } from "@/services/reducers/formReducer"
import { m } from "framer-motion"
import { useContext } from "react"

const { SET_SLIDERVALUE } = FormActionKind

const SliderComponent = () => {
  const { t } = useTranslation()
  const context = useContext(FormContext)
  const { validate, formState } = context
  const { formValues, sliderValue, isEditing } = formState
  const { dispatch } = useContext(FormDispatchContext)

  if (!validate) {
    throw new Error("No validate found in sliderComponent")
  }

  const sliderVal = (value: number): number => {
    const validated = validate(value, formState)

    if (!isEditing) {
      dispatch({ type: SET_SLIDERVALUE, payload: validated })
    }

    return value
  }

  return (
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
        value={[sliderValue]}
        onValueChange={([val]) => sliderVal(val)}
        max={formValues.words.selected ? maxLengthForWords : maxLengthForChars}
        min={formValues.words.selected ? minLengthForWords : minLengthForChars}
        step={1}
      >
        <m.span initial={{ scale: 1 }} whileTap={{ scale: 0.9 }} whileFocus={{ scale: 0.9 }} />
      </Slider>
    </div>
  )
}

export { SliderComponent }
