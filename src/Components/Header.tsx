import { LogoIcon } from "@/assets/icons/logoIcon"
import { useLanguage, useTranslation } from "@/common/hooks/useLanguage"
import { FormContext } from "@/common/providers/FormProvider"
import { debounce } from "@/common/utils/debounce"
import { isIOS } from "@/common/utils/helpers"
import { supportedLanguages } from "@/config"
import type { Language } from "@/models/translations"
import { worker } from "@/services/initWorker"

import "@/styles/Header.css"
import { motion } from "framer-motion"
import { useCallback, useContext } from "react"

function dispatchLanguageEvent(lang: Language) {
  worker.postMessage(lang)
}

export const Header = () => {
  const { formState, generate } = useContext(FormContext)
  const { t } = useTranslation()
  const { language } = useLanguage()

  function handleOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const name = event.currentTarget.name as Language
    debounceChange(name)
  }

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value as Language
    debounceChange(value)
  }

  async function changeLanguage(lang: Language) {
    if (supportedLanguages.includes(lang)) {
      formState.language = lang
      dispatchLanguageEvent(formState.language)
      await generate(formState)
    }
  }

  const debounceChange = useCallback(
    (lang: Language) => debounce(async () => await changeLanguage(lang), 150)(),
    [],
  )

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
                    {active ? (
                      <motion.span layoutId="PickerBackground" className="PickerBackground" />
                    ) : null}
                    <span className="LanguageText relative">{language}</span>
                  </button>
                )
              })
            : null}
          {/* iOS has a great native select element, so that's used here */}
          {isIOS ? (
            <select className="SelectDropDown" onChange={handleChange} value={language}>
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
