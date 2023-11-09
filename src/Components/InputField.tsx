import { FormContext } from "@/Components/FormContext"
import { Checkbox, InputComponent, Label, RadioGroup, RadioGroupItem } from "@/Components/ui"
import { t, validateLength } from "@/common/utils"
import { inputFieldMaxLength, labelForCheckbox } from "@/config"
import { IndexableFormValues, InputLabel, InputValue } from "@/models"
import { ReactNode, useContext } from "react"

type InputFieldProps = {
  option: InputLabel
  values: InputValue
  valuesToForm: (option: InputLabel, event: string | boolean, value: "selected" | "value") => void
}

type SimpleInputProps = {
  formValues: IndexableFormValues
} & InputFieldProps

type TextInputProps = {
  formValues: IndexableFormValues
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
  return (
    <div key={option} className="checkboxParent flex-center" style={{ gridArea: `${option}` }}>
      <Checkbox
        aria-label={labelForCheckbox(option)}
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
  return (
    <div key={option} className="flex-center radio">
      <RadioGroup
        defaultValue={formValues[option].selected.toString()}
        onValueChange={(event) => {
          const isBool = event === "true" ? true : false
          valuesToForm(option, isBool, "selected")
        }}
      >
        <div className="flex-center">
          <RadioGroupItem value="true" id="r1" key="r1" />
          <Label htmlFor="r1">Käytä sanoja</Label>
        </div>
        <div className="flex-center">
          <RadioGroupItem value="false" id="r2" key="r2" />
          <Label htmlFor="r2">Käytä merkkejä</Label>
        </div>
      </RadioGroup>
    </div>
  )
}

const TextInput = ({ option, values, valuesToForm, formValues, isDisabled }: TextInputProps) => {
  return (
    <div key={option} className="textInputBox">
      {formValues.words.selected ? (
        <div className="fadeIn labelOnTop">
          <Label className="flex-bottom" title={values.info} htmlFor={option}>
            {labelForCheckbox(option)}
            {isDisabled ? <span className="resultHelperText">{t("promptToAddWords")}</span> : null}
          </Label>
          <InputComponent
            disabled={isDisabled}
            className="TextInput"
            maxLength={inputFieldMaxLength}
            defaultValue={formValues[option].value}
            placeholder={t("inputPlaceholder").toString()}
            onChange={(event) => {
              valuesToForm(option, validateLength(event.target.value, inputFieldMaxLength), "value")
            }}
          />
        </div>
      ) : (
        <div key={option} className="flex-center fadeIn">
          <Checkbox
            aria-label={labelForCheckbox(option)}
            className="checkboxRoot"
            checked={formValues[option].selected}
            onCheckedChange={(event) => {
              valuesToForm(option, event, "selected")
            }}
            id={option}
            value={values.selected.toString()}
          ></Checkbox>
          <Label htmlFor={option}>Erikoismerkit</Label>
        </div>
      )}
    </div>
  )
}

