import {
  maxLengthForChars,
  maxLengthForWords,
  minLengthForChars,
  minLengthForWords,
} from "@/../config"
import { Label, Slider } from "@/Components/ui"
import { IndexableFormValues } from "@/models"
import { t } from "@/utils/getLanguage"
import { motion } from "framer-motion"

type SliderComponentProps = {
  sliderValue: number
  formValues: IndexableFormValues
  validate: (sliderValue: number) => number
  sliderVal: (value: number) => number
}

const SliderComponent: React.FC<SliderComponentProps> = ({
  sliderValue,
  formValues,
  validate,
  sliderVal,
}) => {
  console.log(sliderValue)

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
