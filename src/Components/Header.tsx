import { LogoIcon } from "@/assets/icons/logoIcon"
import { useLanguage, useTranslation } from "@/common/hooks/useLanguage"
import { getLanguagePath, setLangCookie } from "@/common/utils/detectLanguage"
import { isIOS } from "@/common/utils/helpers"
import { supportedLanguages } from "@/config"
import type { Language } from "@/models/translations"

import "@/styles/Header.css"

export const Header = () => {
  const { t } = useTranslation()
  const { language } = useLanguage()

  const isActive = (lang: Language) => lang === language

  return (
    <div className="flex-center space-between mb-15">
      <div className="flex-center" style={{ gap: "1rem" }}>
        <LogoIcon width={40} height={40} />
        <h1 className="MainTitle">{t("salasanakone")}</h1>
      </div>
      <div className="LanguageAndLink">
        <div className="LanguagePicker">
          {!isIOS
            ? supportedLanguages.map((lang) => {
                const active = isActive(lang)
                return (
                  <a
                    key={lang}
                    href={getLanguagePath(lang)}
                    onClick={() => setLangCookie(lang)}
                    className={active ? "ActiveLanguageButton" : "InactiveLanguageButton"}
                    data-state={active}
                    aria-current={active ? "page" : undefined}
                  >
                    {active ? <span className="PickerBackground" /> : null}
                    <span className="LanguageText relative">{lang}</span>
                  </a>
                )
              })
            : null}
          {/* iOS has a great native select element, so that's used here */}
          {isIOS ? (
            <select
              className="SelectDropDown"
              onChange={(e) => {
                const newLang = e.target.value as Language
                setLangCookie(newLang)
                window.location.href = getLanguagePath(newLang)
              }}
              value={language}
            >
              {supportedLanguages.map((lang) => (
                <option value={lang} key={lang}>
                  {t(lang)}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>
    </div>
  )
}
