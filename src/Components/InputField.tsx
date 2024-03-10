import { SimplePopover } from "@/Components"
import { FormContext } from "@/Components/FormContext"
import { Checkbox, InputComponent, Label, RadioGroup, RadioGroupItem } from "@/Components/ui"
import { useTranslation } from "@/common/utils/getLanguage"
import { validateLength } from "@/common/utils/helpers"
import { inputFieldMaxLength, labelForCheckbox } from "@/config"
import type { InputLabel, InputValue, PassCreationRules } from "@/models"
import { m } from "framer-motion"
import { InfoCircle } from "iconoir-react"
import { type ReactNode, useContext, useRef } from "react"

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
      return <RadioInput valuesToForm={valuesToForm} option={option} values={values} />
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
  const { t } = useTranslation()

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
      />
      <Label title={t(values.info).toString()} htmlFor={option}>
        {labelForCheckbox(option)}
      </Label>
    </div>
  )
}

const RadioInput = ({ option, valuesToForm }: Omit<SimpleInputProps, "formValues">): ReactNode => {
  const { t } = useTranslation()
  const { formState } = useContext(FormContext)
  const { words } = formState.formValues
  const { noDatasetFetched, hasDeletedDatasets } = formState.dataset
  const radioStates = {
    passphrase: "passphrase",
    password: "password",
  } as const
  const isWordsDisabled = noDatasetFetched || hasDeletedDatasets

  return (
    <div key={option} className="flex-center radio">
      <RadioGroup
        defaultValue={
          words.selected && !isWordsDisabled ? radioStates.passphrase : radioStates.password
        }
        onValueChange={(event) => {
          if (!isWordsDisabled) {
            const isBool = event === radioStates.passphrase
            valuesToForm(option, isBool, "selected")
          }
        }}
      >
        <div className="flex-center">
          <RadioGroupItem value={radioStates.passphrase} id="r1" key="r1" />
          <Label aria-disabled={isWordsDisabled} htmlFor="r1">
            {t("useWords")}
          </Label>
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
          <RadioGroupItem value={radioStates.password} id="r2" key="r2" />
          <Label htmlFor="r2">{t("useCharacters")}</Label>
        </div>
      </RadioGroup>
    </div>
  )
}

const TextInput = ({ option, values, valuesToForm, formValues, isDisabled }: TextInputProps) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const { words, randomChars } = formValues

  const handleSave = () => {
    if (inputRef.current) {
      if (randomChars.value === inputRef.current.value) return
      valuesToForm(option, validateLength(inputRef.current?.value, inputFieldMaxLength), "value")
      inputRef.current.blur()
    }
  }

  return (
    <div key={option} className="textInputBox">
      {words.selected ? (
        <div className="blurFadeIn flex InputWithButton">
          <div className="labelOnTop">
            <Label className="flex-bottom" title={t(values.info).toString()} htmlFor={option}>
              {labelForCheckbox(option)}
              {isDisabled ? (
                <span className="resultHelperText">{t("promptToAddWords")}</span>
              ) : null}
            </Label>

            <div className="InputButtonWrapper flex gap-05">
              <InputComponent
                ref={inputRef}
                disabled={isDisabled}
                aria-label={t("separatorInputLabel").toString()}
                className="TextInput"
                maxLength={inputFieldMaxLength}
                defaultValue={randomChars.value}
                placeholder={t("inputPlaceholder").toString()}
                onBlur={handleSave}
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
          />
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
    <m.button
      className="SaveInputButton interact"
      aria-label={t("saveCustomSeparatorDesc").toString()}
      data-animate={true}
      onClick={(e) => {
        if (!isDisabled) {
          e.preventDefault()
          handleSave()
        }
      }}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      disabled={isDisabled}
    >
      {t("saveCustomSeparator")}
    </m.button>
  )
}
