import {
  maxLengthForChars,
  maxLengthForWords,
  minLengthForChars,
  minLengthForWords,
} from "@/../config"
import { Label, Slider } from "@/Components/ui"
import { t } from "@/common/utils/getLanguage"
import { setSliderValue } from "@/features/passphrase-form/passphrase-form.slice"
import { RootState } from "@/store"
import { motion } from "framer-motion"
import { FC } from "react"
import { useDispatch, useSelector } from "react-redux"

type SliderComponentProps = {
  validate: (value: number) => number
}

const SliderComponent: FC<SliderComponentProps> = ({ validate }) => {
  const sliderValue = useSelector((state: RootState) => state.passphraseForm.sliderValue)
  const formValues = useSelector((state: RootState) => state.passphraseForm.formValues)
  const dispatch = useDispatch()

  const sliderVal = (value: number): number => {
    const validated = validate(value)
    dispatch(setSliderValue(validated))
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
