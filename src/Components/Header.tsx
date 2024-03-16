import { FormContext, FormDispatchContext } from "@/Components/FormContext"
import { LogoIcon } from "@/assets/icons/logoIcon"
import { useLanguage, useTranslation } from "@/common/utils/getLanguage"
import { supportedLanguages } from "@/config"
import type { Language } from "@/models/translations"

import "@/styles/Header.css"
import { useContext } from "react"

const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent === "MacIntel" && navigator.maxTouchPoints > 1)

export const Header = () => {
  const { dispatch } = useContext(FormDispatchContext)
  const { formState, generate } = useContext(FormContext)
  const { t } = useTranslation()
  const { language } = useLanguage()

  function handleOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const name = event.currentTarget.name as Language
    formState.language = name
    generate(formState)
  }

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value as Language
    formState.language = value
    generate(formState)
  }

  const isActive = (lang: Language) => lang === language
  return (
    <div className="flex-center space-between">
      <div className="flex-center" style={{ gap: "1rem" }}>
        <LogoIcon width={40} height={40} />
        <h1 className="MainTitle">{t("salasanakone")}</h1>
      </div>
      <div className="LanguageAndLink">
        <div className="LanguagePicker">
          {!isIOS
            ? supportedLanguages.map((language) => {
                const active = isActive(language)
                return (
                  <button
                    key={language}
                    type="button"
                    name={language}
                    className={active ? "ActiveLanguageButton" : "InactiveLanguageButton"}
                    onClick={handleOnClick}
                    data-state={active}
                    disabled={active}
                  >
                    {active ? <span className="PickerBackground" /> : null}
                    <span className="LanguageText relative">{language}</span>
                  </button>
                )
              })
            : null}
          {isIOS ? (
            <select className="SelectDropDown" onChange={handleChange} defaultValue={language}>
              {supportedLanguages.map((language) => {
                return (
                  <option value={language} key={language}>
                    {t(language)}
                  </option>
                )
              })}
            </select>
          ) : null}
        </div>
      </div>
    </div>
  )
}
