import { Share } from "@/Components"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui"
import { meta } from "@/assets/constants/meta"
import { LogoIcon } from "@/assets/icons/logoIcon"
import { t } from "@/common/utils"
import "@/styles/Credits.css"
import "@/styles/ui/Tooltip.css"

const version = import.meta.env.VITE_VERSION

const Credits = () => {
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
      <a
        className="versionLink interact opacity-75 hover"
        href={`https://www.github.com/ogdakke/salasanakone/releases/${version}`}
        target="_blank"
        rel="noreferrer"
      >
        v{version}
      </a>
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
