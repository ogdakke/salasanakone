import { FormContext } from "@/common/providers/FormProvider"
import {
  maxLengthForChars,
  maxLengthForWords,
  minLengthForChars,
  minLengthForWords,
} from "@/config"

import { Label } from "@/Components/ui/label"
import { Slider } from "@/Components/ui/slider"
import { useTranslation } from "@/common/hooks/useLanguage"
import { validatePasswordLength } from "@/common/utils/validations"
import { motion } from "framer-motion"
import { useContext } from "react"

export const SliderComponent = () => {
  const { t } = useTranslation()
  const { formState, generate } = useContext(FormContext)
  const { formValues, sliderValue, isEditing } = formState

  const handleValueChange = (value: number | undefined): void => {
    const validated = validatePasswordLength(value ?? 0, formValues.words.selected)

    if (!isEditing) {
      formState.sliderValue = validated
      generate(formState)
    }
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
        <motion.span initial={{ scale: 1 }} whileTap={{ scale: 0.9 }} whileFocus={{ scale: 0.9 }} />
      </Slider>
    </Label>
  )
}
