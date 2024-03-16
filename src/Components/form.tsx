import { Island, SimplePopover, SliderComponent } from "@/Components"
import { Checkbox, InputComponent, Label, RadioGroup, RadioGroupItem } from "@/Components/ui"
import { FormContext } from "@/common/providers/FormProvider"
import { useLanguage, useTranslation } from "@/common/utils/getLanguage"
import { validateLength } from "@/common/utils/helpers"
import { validatePasswordLength } from "@/common/utils/validations"
import { inputFieldMaxLength } from "@/config"
import type { FormState } from "@/models"
import "@/styles/Form.css"
import "@/styles/ui/Checkbox.css"
import type { CheckedState } from "@radix-ui/react-checkbox"
import { InfoCircle, WarningTriangle } from "iconoir-react"
import React, { type ComponentPropsWithoutRef, useContext, useRef, type ElementRef } from "react"

const Result = React.lazy(async () => await import("@/Components/result"))

const radioStates = {
  passphrase: "passphrase",
  password: "password",
} as const

const display = { visible: "visible", hidden: "hidden" } as const

export default function FormComponent(): React.ReactNode {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { formState, generate } = useContext(FormContext)
  const inputRef = useRef<ElementRef<typeof InputComponent>>(null)
  const { formValues, sliderValue, dataset } = formState
  const { words, numbers, randomChars, uppercase } = formValues
  const { deletedDatasets, failedToFetchDatasets } = dataset

  const inputFieldShouldDisable = words.selected && sliderValue < 2
  const isErrorInLanguage = failedToFetchDatasets.includes(language)
  const isDatasetDeleted = deletedDatasets.includes(language)

  function handleCheckedChange(event: CheckedState, key: keyof FormState["formValues"]): void {
    if (typeof event !== "boolean") return
    formState.formValues[key].selected = event
    generate(formState)
  }

  function handleTextInputSubmit(value: string) {
    // Early return in case of same value in state
    if (value === formState.formValues.randomChars.value) return

    const subStrIfTooLong = validateLength(value, inputFieldMaxLength)
    formState.formValues.randomChars.value = subStrIfTooLong
    generate(formState)
  }

  return (
    <>
      <form className="form blurFadeIn" aria-busy="false" style={{ opacity: "1" }}>
        <Result aria-busy="false" aria-label={t("resultHelperLabel")} />
        <div className="FormLayout">
          {/* Words or password */}
          <WordsRadioGroup
            className="TwoRadioGroup"
            words={words}
            isDatasetDeleted={isDatasetDeleted}
            isErrorInLanguage={isErrorInLanguage}
          />
          <div className="FormCheckBoxes">
            {/* Numbers */}
            <Label
              className="flex-center gap-05 FormCheckBox"
              title={t("useNumbersInfo").toString()}
            >
              <Checkbox
                value="numbers"
                checked={numbers.selected}
                onCheckedChange={(e) => handleCheckedChange(e, "numbers")}
              />
              {t("useNumbers")}
            </Label>
            {/* Uppercase */}
            <Label
              className="flex-center gap-05 FormCheckBox"
              title={t("useUppercaseInfo").toString()}
            >
              <Checkbox
                value="uppercase"
                checked={uppercase.selected}
                onCheckedChange={(e) => handleCheckedChange(e, "uppercase")}
              />
              {t("useUppercase")}
            </Label>
            {/* Random chars */}
            <Label
              className="flex-center gap-05 FormCheckBox __Stack"
              data-state={words.selected ? display.hidden : display.visible}
              title={t("useSpecialsInfo").toString()}
            >
              <Checkbox
                checked={randomChars.selected}
                value="specials"
                onCheckedChange={(e) => handleCheckedChange(e, "randomChars")}
              />
              {t("useSpecials")}
            </Label>
          </div>

          {/* Slider */}
          <div className="SliderWrapper">
            <SliderComponent />
          </div>

          {/* Input for user submitted separator */}
          <div
            className="TextInputBox"
            data-state={words.selected ? display.visible : display.hidden}
          >
            <Label title={t("useSeparatorInfo").toString()}>
              {t("useSeparator")}
              <InputComponent
                ref={inputRef}
                className="TextInput"
                maxLength={inputFieldMaxLength}
                defaultValue={randomChars.value}
                disabled={inputFieldShouldDisable}
                placeholder={t("inputPlaceholder").toString()}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleTextInputSubmit(e.currentTarget.value)
                    e.currentTarget.blur()
                  }
                }}
                onBlur={(e) => handleTextInputSubmit(e.target.value)}
              />
            </Label>
          </div>
        </div>
      </form>
      <div className="IslandWrapper blurFadeIn">
        <Island />
      </div>
    </>
  )
}

type WordsRadioGroupProps = {
  words: FormState["formValues"]["words"]
  isDatasetDeleted: boolean
  isErrorInLanguage: boolean
  className?: ComponentPropsWithoutRef<typeof RadioGroup>["className"]
}

const WordsRadioGroup = ({
  words,
  isDatasetDeleted,
  isErrorInLanguage,
  className = "",
}: WordsRadioGroupProps) => {
  const { t } = useTranslation()
  const { generate, formState } = useContext(FormContext)

  const isWordsDisabled = isErrorInLanguage || isDatasetDeleted

  function handleRadioChange(event: string) {
    const wordsIsSelected = event === radioStates.passphrase
    if (!isWordsDisabled) {
      formState.formValues.words.selected = wordsIsSelected
      /** sliderValue depends on words being selected, so set that here */
      formState.sliderValue = validatePasswordLength(formState.sliderValue, wordsIsSelected)
      generate(formState)
    }
  }

  return (
    <RadioGroup
      className={className}
      defaultValue={
        words.selected && !isDatasetDeleted ? radioStates.passphrase : radioStates.password
      }
      value={
        isWordsDisabled
          ? radioStates.password
          : words.selected
            ? radioStates.passphrase
            : radioStates.password
      }
      onValueChange={handleRadioChange}
    >
      <div className="flex-center">
        <Label
          className="RadioGroupItemLabel"
          title={t("useWordsInfo").toString()}
          aria-disabled={isWordsDisabled}
        >
          <RadioGroupItem value={radioStates.passphrase} aria-disabled={isWordsDisabled} />
          {t("useWords")}
        </Label>
        <SimplePopover text={isErrorInLanguage ? t("errorInFetchingDataset") : t("passphraseDesc")}>
          {isErrorInLanguage ? (
            <WarningTriangle
              className="interact SimplePopoverTrigger"
              data-state="error"
              height={18}
              width={18}
              strokeWidth={2}
              alignmentBaseline="central"
            />
          ) : (
            <InfoCircle
              key={"info"}
              className="interact SimplePopoverTrigger"
              height={18}
              width={18}
              strokeWidth={2}
              alignmentBaseline="central"
            />
          )}
        </SimplePopover>
      </div>

      <Label className="RadioGroupItemLabel" title={t("useCharactersInfo").toString()}>
        <RadioGroupItem value={radioStates.password} />
        {t("useCharacters")}
      </Label>
    </RadioGroup>
  )
}
