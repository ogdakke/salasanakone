import "@/styles/ui/Feedback.css"

import { ChatBubbleEmpty, OpenNewWindow } from "iconoir-react"

import { usePersistedState } from "@/common/hooks/usePersistedState"
import { useTranslation } from "@/common/utils/getLanguage"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui"

interface clickValueType {
  value: boolean
}

export const Feedback = () => {
  const { t } = useTranslation()
  const initialClickValues: clickValueType = {
    value: false,
  }
  const [clicked, setClicked] = usePersistedState("isClicked", initialClickValues)

  if (clicked.value === false) {
    return (
      <div key={"notClicked"}>
        <form className="" action="submit" method="post" style={{ opacity: 1 }}>
          <div title="Anna palautetta sivustosta">
            <a
              onClick={() => {
                setClicked({
                  value: true,
                })
              }}
              className="submitButton inputButton flex-center no-decoration"
              target="_blank"
              rel="noreferrer"
              href="https://palaute.simple.ink/"
            >
              {t("leaveFeedback")}
              <OpenNewWindow width={20} height={20} />
            </a>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div key={"clicked"} className="flex-center">
        <TooltipProvider delayDuration={600}>
          <Tooltip>
            <TooltipTrigger className="flex-center interact hover resultHelperText" asChild>
              <a
                className="flex-center no-decoration"
                target="_blank"
                rel="noreferrer"
                href="https://palaute.simple.ink/"
              >
                <ChatBubbleEmpty className="interact " />
                {t("thanksForFeedback")}
              </a>
            </TooltipTrigger>
            <TooltipContent className="TooltipContent" sideOffset={4}>
              <p>{t("thanksForFeedbackLeaveAnother")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }
}
