import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { Suspense, useCallback, useEffect, useState } from "react";
import { FormType } from "./form";
import "../styles/Indicator.css"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
import { OpenSelectHandGesture } from "iconoir-react";
import { Divider } from "./ui/divider";

const checker = async (password: string) => {
  // const then = performance.now()
  const check = await import("../Api/checkStrength").then((r) => r.checkStrength)
  // const now = performance.now()
  // console.log("🚀 ~ file: indicator.tsx:8 ~ checker ~ now:", now-then, "ms")
  
  return (await check(password.toString()))
}

const validateLength = (str: string) => {
  let final = str  
  if (str.length > 100) {
    final = str.substring(0, 100)
  }
  return final
}

const parseValue = (value: number): number => {
  let mutatedValue = value
  if (value.toString().length > 7) {
    mutatedValue = Math.floor(value / 1000000)
  }
  return mutatedValue
}

let didInit = false
let didCheckTime = false

export function StrengthIndicator(props: { formValues: FormType; password: string; sliderValue: number; }): JSX.Element {  
  const {formValues, password, sliderValue} = props;
  
  
  const validateString = useCallback(() => {
    if (!formValues.words && sliderValue > 15) {
      // a rndm string needs not be checked if its longer than 15
      return false
    } else if (formValues.words && sliderValue > 3) {
      return false
    }
    return true
  }, [formValues, sliderValue])

  const [output, setOutput] = useState("Loistava")
  
  const [score, setScore] = useState(4)
  const [time, setTime]= useState<string[]>([""])
  

  const timeToCheck = async () => {
    // didCheckTime prevents unneccessary computation. eg. user clicks again, even if password has not changed
    if (!didCheckTime) {
      // console.time("timeToCheck")
      didCheckTime = true
      await checker(validateLength(password)).then((r) => {
        // const timeInSecs = r.crack_times_seconds.offline_slow_hashing_1e4_per_second.toLocaleString("en").replace(RegExp(/,/g), "")
        // const timeInt = parseInt(timeInSecs.toString())
        // const years = Math.floor(timeInt / 31556952)
        // const finalTime = parseValue(years)
        const timeToDo = r.crack_times_display.offline_slow_hashing_1e4_per_second.toString()
        setTime([changeToFi(timeToDo)])
      })
      // console.timeEnd("timeToCheck")
    }
  }


  // runs excactly once when mounting/initializing. -- so runs on page load.
  useEffect(() => {
    if (!didInit) {      
        didInit = true
        checker(password).then(r => {
          setScore(r.score)
          setOutput(numberToString(r.score))
        })
      }
      return;
  }, [password])


  useEffect(() => {
    // THis is run each time the dep array gets a hit, so set time check to false.
    didCheckTime = false
    // kikkailua, jotta ei tarvis laskea aina scorea, koska se on kallista.
    if (validateString() === false) {
      setScore(4)
      setOutput(numberToString(4))
    } else {
      checker(password).then(r => {
        setScore(r.score)
        setOutput(numberToString(score))
      }) 
    }
  }, [score, password, validateString])
    
  // const [op, setOp] = useState(false)

  return (
    <div className="strengthWrapper">
      <Suspense fallback={<div className="strengthIndicator case5"><span>Arvio</span></div>}>
        <Popover modal={true}>
          <PopoverTrigger onClick={async () => {
              // didCheckTime = false
              await timeToCheck()
            }}>
            <div>
              <TooltipProvider delayDuration={600} >
                <Tooltip
                >
                  <TooltipTrigger type="button" >
                    <div className={`strengthIndicator case${score.toString()}`}>
                      <span>
                        {output}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={-5} className="TooltipContent">
                    <div className="withIcon">
                      <OpenSelectHandGesture width={20} height={20} />
                      Lisätietoja
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </PopoverTrigger>
          <PopoverContent align="center" side="top" className="PopoverContent">
            <div className="popCard">
              <p className="resultHelperText">Murtamiseen vaadittu aika</p>
              <div className="">
                <Divider margin="0.25rem 0rem" />
                <p className="fadeIn">{time[0]}</p>
                {/* <p className="fadeIn">{time[1]}</p> */}
              </div>
            </div>
          </PopoverContent>
        </Popover>

      </Suspense>
    </div>
  )
}

function numberToString(value: number) {
  switch(value) {
    case 0:
      return "Surkea";
    case 1:
      return "Huono";
    case 2:
      return "Ok";
    case 3:
      return "Hyvä";
    case 4:
      return "Loistava";
    default:
      return "Arvio";
  }
}

const changeToFi = (value: string) => {
  if (value === "1 second") return "1 sekunti";
  else if (value.includes("under a second")) return value.replace("under a second", "Alle sekunti") 
  else if (value.includes("seconds")) return value.replace("seconds", "sekuntia") 
  else if (value.includes("minutes")) return value.replace("minutes", "minuuttia")
  else if (value.includes("hours")) return value.replace("hours", "tuntia")
  else if (value.includes("days")) return value.replace("days", "päivää")
  else if (value.includes("months")) return value.replace("months", "kuukautta")
  else if (value.includes("years")) return value.replace("years", "vuotta")
  
  // Singural values: "päivä", "vuosi" etc.
  else if (value.includes("day")) return value.replace("day", "päivä")
  else if (value.includes("year")) return value.replace("year", "vuosi")
  else if (value.includes("centuries")) return value.replace("centuries", "Useita vuosikymmeniä")
  
  else return value
}