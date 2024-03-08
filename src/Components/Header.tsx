import { FormDispatchContext } from "@/Components/FormContext"
import { LogoIcon } from "@/assets/icons/logoIcon"
import { useLanguage, useTranslation } from "@/common/utils/getLanguage"
import { Language } from "@/models/translations"
import { setLanguage } from "@/services/reducers/formReducer"

import "@/styles/Header.css"
import { useContext } from "react"

const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent === "MacIntel" && navigator.maxTouchPoints > 1)

export const Header = () => {
  const { dispatch } = useContext(FormDispatchContext)
  const { t } = useTranslation()
  const { language } = useLanguage()

  function handleOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const name = event.currentTarget.name as Language
    dispatch(setLanguage(name))
  }

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value as Language
    console.log(value)

    dispatch(setLanguage(value))
  }

  const languages = Object.values(Language)
  const isActive = (lang: Language) => lang === language
  return (
    // TODO: looks weird on mobile
    <div className="flex-center space-between">
      <div className="flex-center" style={{ gap: "1rem" }}>
        <LogoIcon width={40} height={40} />
        <h1>{t("salasanakone")}</h1>
      </div>
      <div className="LanguageAndLink">
        <div className="LanguagePicker">
          {!isIOS
            ? languages.map((language) => {
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
            <select onChange={handleChange}>
              {languages.map((language, i) => {
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
