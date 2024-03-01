import { meta } from "@/assets/constants/meta"
import { LogoIcon } from "@/assets/icons/logoIcon"
import { useTranslation } from "@/common/utils/getLanguage"
import { Share } from "@/Components"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui"
import "@/styles/Credits.css"
import "@/styles/ui/Tooltip.css"

const version = __APP_VERSION__

const Credits = () => {
  const { t } = useTranslation()
  return (
    <div className="creditsWrapper">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="credits">
              <LogoIcon loading="lazy" width={20} height={20} className="interact" />
              <a href={meta.dweUrl} target="_blank" rel="noreferrer">
                {meta.dweDisplayText}
              </a>
            </button>
          </TooltipTrigger>
          <TooltipContent className="TooltipContent" sideOffset={0} asChild>
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
          v{version}
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

export { Credits }
