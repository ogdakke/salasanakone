import { meta } from "../../assets/constants/meta"
import { LogoIcon } from "../../assets/icons/logoIcon"
import "../../styles/ui/Tooltip.css"
import { ShareComponent } from "../share"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { ExternalLink } from "./externalLink"

export const Credits = () => {
  return (
    <div className="imageWrapper">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="credits">
              <LogoIcon loading="lazy" width={20} height={20} className="svgImage interact" />
              <ExternalLink link={meta.dweUrl} size={18}>
                dwe.fi
              </ExternalLink>
            </button>
          </TooltipTrigger>
          <TooltipContent className="TooltipContent" sideOffset={0}>
            <p>Vieraile sivuillani</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger>
            <ShareComponent />
          </TooltipTrigger>
          <TooltipContent className="TooltipContent" sideOffset={0}>
            <p>Jaa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
