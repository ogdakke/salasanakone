import { FormDispatchContext } from "@/Components/FormContext"
import { LogoIcon } from "@/assets/icons/logoIcon"
import { useLanguage, useTranslation } from "@/common/utils/getLanguage"
import { Language } from "@/models/translations"
import { setLanguage } from "@/services/reducers/formReducer"

import "@/styles/Header.css"
import { motion } from "framer-motion"
import { useContext } from "react"

export const Header = () => {
  const { dispatch } = useContext(FormDispatchContext)
  const { t } = useTranslation()
  const { language } = useLanguage()

  function handleOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const name = event.currentTarget.name as Language
    dispatch(setLanguage(name))
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
          {languages.map((language) => {
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
                {active ? (
                  <motion.span layoutId="active-language" className="PickerBackground" />
                ) : null}
                <span className="LanguageText relative">{language}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
