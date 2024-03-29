import { Share } from "@/Components/share"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"
import { meta } from "@/assets/constants/meta"
import { useTranslation } from "@/common/hooks/useLanguage"
import "@/styles/Credits.css"
import "@/styles/ui/Tooltip.css"

const version = __APP_VERSION__

export const Credits = () => {
  const { t } = useTranslation()
  return (
    <div className="creditsWrapper">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a className="CreditsLink" href={meta.dweUrl} target="_blank" rel="noreferrer">
              ©{meta.dweDisplayText}
            </a>
          </TooltipTrigger>
          <TooltipContent className="TooltipContent" sideOffset={10} asChild>
            <span>{t("visitMySite")}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {version ? (
        <a
          className="versionLink interact opacity-75 hover"
          href={`https://www.github.com/ogdakke/salasanakone/releases/${version}`}
          target="_blank"
          rel="noreferrer"
        >
          {version}
        </a>
      ) : null}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger>
            <Share />
          </TooltipTrigger>
          <TooltipContent className="TooltipContent" sideOffset={0} asChild>
            <span>{t("share")}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
