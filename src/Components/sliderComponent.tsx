import { FormContext } from "@/Components/FormContext"
import {
  maxLengthForChars,
  maxLengthForWords,
  minLengthForChars,
  minLengthForWords,
} from "@/config"

import { Label, Slider } from "@/Components/ui"
import { useTranslation } from "@/common/utils/getLanguage"
import { validatePasswordLength } from "@/common/utils/validations"
import { m } from "framer-motion"
import { useContext } from "react"

const SliderComponent = () => {
  const { t } = useTranslation()
  const context = useContext(FormContext)
  const { formState, generate } = context
  const { formValues, sliderValue, isEditing } = formState

  const handleValueChange = (value: number): number => {
    const validated = validatePasswordLength(value, formValues.words.selected)

    if (!isEditing) {
      formState.sliderValue = validated
      generate(formState)
    }

    return value
  }

  return (
    <Label>
      {formValues.words.selected
        ? t("lengthOfPassPhrase", {
            passLength: sliderValue.toString(),
          })
        : t("lengthOfPassWord", {
            passLength: sliderValue.toString(),
          })}
      <Slider
        defaultValue={[sliderValue]}
        value={[sliderValue]}
        onValueChange={([val]) => handleValueChange(val)}
        max={formValues.words.selected ? maxLengthForWords : maxLengthForChars}
        min={formValues.words.selected ? minLengthForWords : minLengthForChars}
        step={1}
      >
        <m.span initial={{ scale: 1 }} whileTap={{ scale: 0.9 }} whileFocus={{ scale: 0.9 }} />
      </Slider>
    </Label>
  )
}

export { SliderComponent }
