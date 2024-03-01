import { useTranslation, validateLength } from "@/common/utils"
import { SimplePopover } from "@/components"
import { inputFieldMaxLength, labelForCheckbox } from "@/config"
import { InputLabel, InputValue, PassCreationRules } from "@/models"
import { FormContext } from "@components/FormContext"
import { Checkbox, InputComponent, Label, RadioGroup, RadioGroupItem } from "@components/ui"
import { motion } from "framer-motion"
import { FloppyDisk, InfoCircle } from "iconoir-react"
import { ReactNode, useContext, useRef } from "react"

type InputFieldProps = {
  option: InputLabel
  values: InputValue
  valuesToForm: (option: InputLabel, event: string | boolean, value: "selected" | "value") => void
}

type SimpleInputProps = {
  formValues: PassCreationRules
} & InputFieldProps

type TextInputProps = {
  formValues: PassCreationRules
  isDisabled: boolean
} & InputFieldProps

export const InputField: React.FC<InputFieldProps> = ({ option, values, valuesToForm }) => {
  const { formValues, isDisabled } = useContext(FormContext).formState

  switch (values.inputType) {
    case "radio":
      return (
        <RadioInput
          formValues={formValues}
          valuesToForm={valuesToForm}
          option={option}
          values={values}
        />
      )
    case "input":
      return (
        <TextInput
          option={option}
          values={values}
          valuesToForm={valuesToForm}
          formValues={formValues}
          isDisabled={isDisabled}
        />
      )
    default:
      return (
        <CheckboxInput
          option={option}
          values={values}
          formValues={formValues}
          valuesToForm={valuesToForm}
        />
      )
  }
}

const CheckboxInput = ({ option, values, formValues, valuesToForm }: SimpleInputProps) => {
  if (option === "language") {
    return null //TODO this is fucked
  }

  return (
    <div key={option} className="checkboxParent flex-center" style={{ gridArea: `${option}` }}>
      <Checkbox
        aria-label={labelForCheckbox(option).toString()}
        checked={formValues[option].selected}
        onCheckedChange={(event) => {
          valuesToForm(option, event as boolean, "selected")
        }}
        id={option}
        value={values.selected.toString()}
      ></Checkbox>
      <Label title={values.info} htmlFor={option}>
        {labelForCheckbox(option)}
      </Label>
    </div>
  )
}

const RadioInput = ({ option, formValues, valuesToForm }: SimpleInputProps): ReactNode => {
  const { t } = useTranslation()

  if (option === "language") {
    return null
  }

  return (
    <div key={option} className="flex-center radio">
      <RadioGroup
        defaultValue={formValues[option].selected.toString()}
        onValueChange={(event) => {
          const isBool = event === "true"
          valuesToForm(option, isBool, "selected")
        }}
      >
        <div className="flex-center">
          <RadioGroupItem value="true" id="r1" key="r1" />
          <Label htmlFor="r1">{t("useWords")}</Label>
          <SimplePopover text={t("passphraseDesc")}>
            <InfoCircle
              key={"info"}
              className="interact SimplePopoverTrigger"
              height={18}
              width={18}
              strokeWidth={2}
              alignmentBaseline="central"
            />
          </SimplePopover>
        </div>
        <div className="flex-center">
          <RadioGroupItem value="false" id="r2" key="r2" />
          <Label htmlFor="r2">{t("useCharacters")}</Label>
        </div>
      </RadioGroup>
    </div>
  )
}

const TextInput = ({ option, values, valuesToForm, formValues, isDisabled }: TextInputProps) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  if (option === "language") {
    return null
  }

  const handleSave = () => {
    if (inputRef.current?.value) {
      valuesToForm(option, validateLength(inputRef.current?.value, inputFieldMaxLength), "value")
      inputRef.current.blur()
    }
  }

  return (
    <div key={option} className="textInputBox">
      {formValues.words.selected ? (
        <div className="blurFadeIn flex InputWithButton">
          <div className="labelOnTop">
            <Label className="flex-bottom" title={values.info} htmlFor={option}>
              {labelForCheckbox(option)}
              {isDisabled ? (
                <span className="resultHelperText">{t("promptToAddWords")}</span>
              ) : null}
            </Label>

            <div className="InputButtonWrapper flex gap-05">
              <InputComponent
                ref={inputRef}
                disabled={isDisabled}
                aria-label={t("delimiterInputLabel").toString()}
                className="TextInput"
                maxLength={inputFieldMaxLength}
                defaultValue={formValues[option].value}
                placeholder={t("inputPlaceholder").toString()}
                onPointerCancel={(event) => {
                  valuesToForm(
                    option,
                    validateLength(event.currentTarget.value, inputFieldMaxLength),
                    "value",
                  )
                }}
              />
              <SaveTextInputButton handleSave={handleSave} isDisabled={isDisabled} />
            </div>
          </div>
        </div>
      ) : (
        <div key={option} className="flex-center blurFadeIn">
          <Checkbox
            aria-label={labelForCheckbox(option).toString()}
            className="checkboxRoot"
            checked={formValues[option].selected}
            onCheckedChange={(event) => {
              valuesToForm(option, event, "selected")
            }}
            id={option}
            value={values.selected.toString()}
          ></Checkbox>
          <Label htmlFor={option}>{t("useSpecials")}</Label>
        </div>
      )}
    </div>
  )
}

const SaveTextInputButton = ({
  handleSave,
  isDisabled,
}: {
  handleSave: () => void
  isDisabled: boolean
}) => {
  const { t } = useTranslation()

  return (
    <motion.button
      className="SaveInputButton interact"
      aria-label={t("saveCustomDelimiter").toString()}
      data-animate={true}
      onClick={(e) => {
        if (!isDisabled) {
          e.preventDefault()
          handleSave()
        }
      }}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      disabled={isDisabled}
    >
      <FloppyDisk width={20} height={20} alignmentBaseline="central" className="flex-center" />
    </motion.button>
  )
}
