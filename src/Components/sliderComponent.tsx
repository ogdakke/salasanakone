import {
  maxLengthForChars,
  maxLengthForWords,
  minLengthForChars,
  minLengthForWords,
} from "@/../config"
import { FormContext, FormDispatchContext } from "@/Components/FormContext"

import { Label, Slider } from "@/Components/ui"
import { t } from "@/common/utils"
import { FormActionKind } from "@/services/reducers/formReducer"
import { motion } from "framer-motion"
import { useContext } from "react"

const { SET_SLIDERVALUE } = FormActionKind

const SliderComponent = () => {
  const {
    validate,
    formState: { formValues, sliderValue },
  } = useContext(FormContext)
  const context = useContext(FormDispatchContext)
  const dispatch = context?.dispatch

  if (!validate) {
    throw new Error("No validate found in sliderComponent")
  }

  const sliderVal = (value: number): number => {
    const validated = validate(value)
    dispatch({ type: SET_SLIDERVALUE, payload: validated })
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
        onValueChange={(val) => sliderVal(val[0])}
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
  )
}

export { SliderComponent }

