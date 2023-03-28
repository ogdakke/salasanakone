import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { LogoIcon } from "../../assets/icons/logoIcon"
import { ShareComponent } from "../share"
import { ExternalLink } from "./externalLink"

export const Credits = () => {
  return (
    <div className="imageWrapper">
                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="credits">
                                    <LogoIcon
                                        loading="lazy"
                                        width={20}
                                        height={20}
                                        className="svgImage interact"
                                    />
                                    <ExternalLink link="https://www.dwe.fi" size={18}>
                                      dwe.fi
                                    </ExternalLink>

                                </div>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={0}>
                                <p>Vieraile sivuillani</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger>
                                <ShareComponent />
                            </TooltipTrigger>
                            <TooltipContent sideOffset={0}>
                                <p>Jaa</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
  )
}