import { inputFieldMaxLength, labelForCheckbox } from "@/../config"
import { Checkbox, InputComponent, Label, RadioGroup, RadioGroupItem } from "@/Components/ui"
import { IndexableInputValue, InputLabel, InputValue } from "@/models"
import { t } from "@/utils/getLanguage"
import { validateLength } from "@/utils/helpers"

type InputFieldProps = {
  option: InputLabel
  values: InputValue
  formValues: IndexableInputValue
  isDisabled: boolean
  valuesToForm: (option: InputLabel, event: unknown, value: "selected" | "value") => void
}

export const InputField: React.FC<InputFieldProps> = ({
  option,
  values,
  formValues,
  isDisabled,
  valuesToForm,
}) => {
  if (values.inputType === "checkbox") {
    return (
      <div key={option} className="checkboxParent flex-center" style={{ gridArea: `${option}` }}>
        <Checkbox
          aria-label={labelForCheckbox(option)}
          checked={formValues[option].selected}
          onCheckedChange={(event) => {
            values.selected = !values.selected
            valuesToForm(option, event, "selected")
          }}
          id={option}
          value={values.selected.toString()}
        ></Checkbox>
        <Label title={values.info} htmlFor={option}>
          {labelForCheckbox(option)}
        </Label>
      </div>
    )
  } else if (values.inputType === "radio") {
    return (
      <div key={option} className="flex-center radio">
        <RadioGroup
          defaultValue={formValues[option].selected.toString()}
          onValueChange={(event) => {
            values.selected = !values.selected
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
  } else {
    // if values.inputType === "input"
    return (
      <div key={option} className="textInputBox">
        {formValues.words.selected ? (
          <div className="fadeIn labelOnTop">
            <Label className="flex-bottom" title={values.info} htmlFor={option}>
              {labelForCheckbox(option)}
              {isDisabled ? (
                <span className="resultHelperText">{t("promptToAddWords")}</span>
              ) : (
                <span></span>
              )}
            </Label>
            <InputComponent
              disabled={isDisabled}
              maxLength={inputFieldMaxLength}
              defaultValue={formValues[option].value}
              placeholder={t("inputPlaceholder")}
              onChange={(event) => {
                valuesToForm(
                  option,
                  validateLength(event.target.value, inputFieldMaxLength),
                  "value",
                )
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
                values.selected = !values.selected
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
}
