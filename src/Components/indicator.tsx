import { OpenSelectHandGesture } from "iconoir-react"
import { Suspense, useCallback, useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import "../styles/Indicator.css"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

import { motion } from "framer-motion"
import { IndexableInputValue } from "../models"
import { ErrorComponent } from "./errorComponent"
import { Divider } from "./ui/divider"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

const checker = async (password: string) => {
  const check = await import("../services/checkStrength").then((r) => r.checkStrength)
  return check(password.toString())
}

/**
 * returns a substring of desired length {length} if str is longer than {length}
 * @param length desired length
 * @param str string to check
 * @returns string, mutated or not
 */
export const validateLength = (str: string, length: number) => {
  let final = str
  if (str.length > length) {
    final = str.substring(0, length)
    // console.log(`Checked string of length ${final.length}`)
  }
  // console.log(`Checked string of length ${final.length}`)
  return final
}

const parseValue = (value: number) => {
  let mutatedValue = value
  if (value.toString().length > 10) {
    return "Miljardeja vuosia"
  }
  if (value.toString().length > 7) {
    mutatedValue = Math.floor(value / 1000000)
    return `${mutatedValue} milj. vuotta`
  }
  return mutatedValue.toLocaleString("fi") + " vuotta"
}

let didInit = false
let didCheckTime = false
/**
 * Calculates the strength of a given password and returns a element
 * @param props {object} {formValues: object, password: string, sliderValue: number}
 * @returns JSX element
 */
export function StrengthIndicator(props: {
  formValues: IndexableInputValue
  password: string
  sliderValue: number
}): React.ReactNode {
  const { formValues, password, sliderValue } = props

  const validateString = useCallback(() => {
    if (!formValues.words.selected && sliderValue > 15) {
      // a rndm string needs not be checked if its longer than 15
      return false
    } else if (formValues.words.selected && sliderValue > 4) {
      return false
    }
    return true
  }, [formValues, sliderValue])

  const [output, setOutput] = useState("Loistava")

  const [score, setScore] = useState(4)
  const [time, setTime] = useState<string[]>([])

  const calculateTimeToCheck = async () => {
    // didCheckTime prevents unneccessary computation. eg. user clicks again, even if password has not changed
    if (!didCheckTime) {
      console.time("Time to check")
      didCheckTime = true
      await checker(validateLength(password, 70)).then((r) => {
        let timeToDo = r.crackTimesDisplay.offlineSlowHashing1e4PerSecond.toString()

        const timeInSecs = r.crackTimesSeconds.offlineSlowHashing1e4PerSecond
        const years = Math.floor(timeInSecs / 31556952)

        if (timeToDo.includes("vuotta") || timeToDo.includes("vuosikymmeniä")) {
          timeToDo = parseValue(years)
        }
        setTime([timeToDo])
      })
      console.timeEnd("Time to check")
    }
  }

  // runs excactly once when mounting/initializing. -- so runs on page load.
  /**
   * 4.4.2023
   * Not sure how this actually works, it does not seem to get used, since I've tried to make it wait for a non null password
   */
  useEffect(() => {
    if (!didInit) {
      if (password.length > 0) {
        didInit = true
        checker(validateLength(password, 70))
          .then((r) => {
            // console.log("🚀 ~ file: indicator.tsx:106 ~ checker ~ password:", password)
            console.log("Mounted and checking...")
            setScore(r.score)
            setOutput(numberToString(r.score))
          })
          .catch((err) => {
            console.error("Error in checking", err)
          })
          .finally(() => {
            console.log("Mounted and checked successfully.")
          })
      }
    }
    // eslint-disable react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // THis is run each time the dep array gets a hit, so set time check to false.
    didCheckTime = false
    // kikkailua, jotta ei tarvis laskea aina scorea, koska se on kallista.
    if (!validateString()) {
      setScore(4)
      setOutput(numberToString(4))
    } else {
      if (password.length > 0) {
        checker(password)
          .then((r) => {
            setScore(r.score)
            setOutput(numberToString(r.score))
            console.log("Checked strength succesfully")
          })
          .catch((err) => {
            console.error(err)
          })
      }
    }
    return () => {
      didCheckTime = true
    }
  }, [password])

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        return <ErrorComponent error={error as unknown} resetErrorBoundary={resetErrorBoundary} />
      }}
    >
      <Suspense
        fallback={
          <div className="strengthIndicator case5">
            <span>Arvio</span>
          </div>
        }
      >
        <Popover modal={true}>
          <PopoverTrigger
            onClick={() => {
              void calculateTimeToCheck().catch(console.error)
            }}
          >
            <div>
              <TooltipProvider delayDuration={600}>
                <Tooltip>
                  <TooltipTrigger type="button" asChild>
                    <motion.div
                      layoutId="strengthIndicator"
                      key={output}
                      whileHover={{
                        scale: 1.1,
                        transition: {
                          type: "tween",
                          duration: 0.1,
                        },
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      whileFocus={{}}
                      transition={{
                        type: "spring",
                        duration: 0.1,
                      }}
                      className={`interact strengthIndicator case${score.toString()}`}
                    >
                      <motion.span>{output}</motion.span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={4} className="TooltipContent">
                    <div className="flex-center">
                      <OpenSelectHandGesture width={20} height={20} />
                      Lisätietoja
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </PopoverTrigger>
          <PopoverContent
            style={{
              zIndex: 3,
            }}
            align="center"
            side="top"
            className="PopoverContent"
            onOpenAutoFocus={(e) => {
              e.preventDefault()
            }}
            asChild
          >
            <div className="popCard">
              <p className="fadeIn resultHelperText">Murtamisaika</p>
              <Divider margin="0.25rem 0rem" />
              <div className="flex-center space-between">
                <span>{time[0]}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </Suspense>
    </ErrorBoundary>
  )
}

function numberToString(value: number) {
  switch (value) {
    case 0:
      return "Surkea"
    case 1:
      return "Huono"
    case 2:
      return "Ok"
    case 3:
      return "Hyvä"
    case 4:
      return "Loistava"
    default:
      return "Arvio"
  }
}
