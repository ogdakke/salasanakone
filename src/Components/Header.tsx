import { meta } from "@/assets/constants/meta"
import { LogoIcon } from "@/assets/icons/logoIcon"
import { useLanguage, useTranslation } from "@/common/utils"
import { FormDispatchContext } from "@/components/FormContext"
import { Language } from "@/models/translations"

import { FormActionKind } from "@/services/reducers/formReducer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui"
import { useContext } from "react"

export const Header = () => {
  const { dispatch } = useContext(FormDispatchContext)
  const { t } = useTranslation()
  const { language } = useLanguage()

  function handleOnClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const name = event.currentTarget.name as Language
    console.log("dispatched", name)
    dispatch({
      type: FormActionKind.SET_FORM_FIELD,
      payload: {
        field: "language",
        language: name,
      },
    })
  }
  const isEn = language === Language.en
  const isFi = language === Language.fi

  return (
    // TODO: looks weird on mobile
    <div className="flex-center space-between">
      <div className="flex-center" style={{ gap: "1rem" }}>
        <LogoIcon width={40} height={40} />
        <h1>{t("salasanakone")}</h1>
        <div className="flex gap-05">
          <button
            type="button"
            name="en"
            className={isEn ? "opacity-75" : "interact"}
            onClick={handleOnClick}
            disabled={isEn}
          >
            en
          </button>
          <button
            type="button"
            name="fi"
            className={isFi ? "opacity-75" : "interact"}
            onClick={handleOnClick}
            disabled={isFi}
          >
            fi
          </button>
        </div>
      </div>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="credits">
              <a href={meta.dweUrl} target="_blank" rel="noreferrer">
                {meta.dweDisplayText}
              </a>
            </button>
          </TooltipTrigger>
          <TooltipContent className="TooltipContent" sideOffset={6} asChild>
            <span>{t("visitMySite")}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
