import "../styles/ui/Feedback.css"

import { ChatBubbleEmpty, OpenNewWindow } from "iconoir-react"

import { usePersistedState } from "../hooks/usePersistedState"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface clickValueType {
  value: boolean
}

export const Feedback = () => {
  const initialClickValues: clickValueType = {
    value: false,
  }
  const [clicked, setClicked] = usePersistedState("isClicked", initialClickValues)

  const questionText = "Jätä palaute"

  if (clicked.value === false) {
    return (
      <div>
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
              {questionText}
              <OpenNewWindow width={20} height={20} />
            </a>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div className="flex-center">
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
                Kiitos palautteesta!
              </a>
            </TooltipTrigger>
            <TooltipContent className="TooltipContent" sideOffset={4}>
              <p>
                Kiitos jos annoit palautetta, voit antaa
                <br /> uuden palautteen klikkaamalla.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }
}
