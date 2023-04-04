
import "../styles/ui/Feedback.css"
import { usePersistedState } from "../hooks/usePersistedState"
import { ChatBubbleEmpty, OpenNewWindow } from "iconoir-react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"

interface clickValueType {
  id: string,
  value: boolean
}

export const Feedback = () => {
  const newId = new Date().getTime().toString()

  const initialClickValues: clickValueType = {
    id: newId,
    value: false
  } 
  const [clicked, setClicked] = usePersistedState("isClicked", initialClickValues)

  const questionText = "Mitä mieltä olet sivusta?"
  
  if (clicked.value === false) {
    return (
      <div>
      <form className="" action="submit" method="post" style={{opacity: 1}}>
        <div 
        title="Anna palautetta sivustosta">
          <a onClick={() => setClicked(
            {...initialClickValues,
              value: true
              }
            )}
          className="submitButton inputButton flex-center" href="https://palaute.simple.ink/">
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
        <TooltipTrigger  className="flex-center interact hover resultHelperText" >
            <a className="flex-center" href="https://palaute.simple.ink/">
              <ChatBubbleEmpty className="interact "/>
              Palaute
            </a>
        </TooltipTrigger>
          <TooltipContent className="TooltipContent" sideOffset={4} >
            <p>Kiitos jos annoit palautetta, voit antaa<br /> uuden palautteen klikkaamalla.</p>
          </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
  )
}
}
