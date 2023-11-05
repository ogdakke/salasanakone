import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui"
import { meta } from "@/assets/constants/meta"
import { LogoIcon } from "@/assets/icons/logoIcon"
import { t } from "@/common/utils"

export const Header = () => {
  return (
    // TODO: looks weird on mobile
    <div className="flex-bottom space-between">
      <div className="flex-center" style={{ gap: "1rem" }}>
        <LogoIcon width={40} height={40} />
        <h1>{t("salasanakone")}</h1>
      </div>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="credits">
              <LogoIcon loading="lazy" width={20} height={20} className="interact" />
              <a href={meta.dweUrl}>{meta.dweDisplayText}</a>
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
