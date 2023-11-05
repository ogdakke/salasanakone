import { Share } from "@/Components"
import {
  ExternalLink,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui"
import { meta } from "@/assets/constants/meta"
import { LogoIcon } from "@/assets/icons/logoIcon"
import { t } from "@/common/utils"
import "@/styles/Credits.css"
import "@/styles/ui/Tooltip.css"

const Credits = () => {
  return (
    <div className="imageWrapper">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="credits">
              <LogoIcon loading="lazy" width={20} height={20} className="interact" />
              <ExternalLink link={meta.dweUrl} size={18}>
                {meta.dweDisplayText}
              </ExternalLink>
            </button>
          </TooltipTrigger>
          <TooltipContent className="TooltipContent" sideOffset={0} asChild>
            <span>{t("visitMySite")}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
