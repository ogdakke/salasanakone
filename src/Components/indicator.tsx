import { useSelector } from "@/common/hooks"
import { t } from "@/common/utils/getLanguage"
import { validateLength } from "@/common/utils/helpers"
import "@/styles/Indicator.css"
import { motion } from "framer-motion"
import { useCallback, useEffect, useMemo, useState } from "react"

const checker = async (password: string) => {
  const check = await import("../services/checkStrength").then((r) => r.checkStrength)
  return check(password.toString())
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

export function StrengthIndicator(props: { password: string | undefined }): React.ReactNode {
  const { password } = props

  const formValues = useSelector((state) => state.passphraseForm.formValues)
  const sliderValue = useSelector((state) => state.passphraseForm.sliderValue)

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
    if (password && !didCheckTime) {
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
      if (password && password.length > 0) {
        didInit = true
        checker(validateLength(password, 70))
          .then((r) => {
            console.info("Mounted and checking...")
            setScore(r.score)
            setOutput(numberToString(r.score).label)
          })
          .catch((err) => {
            if (err instanceof Error) throw new Error(err.message)
            console.error("Error in checking", err)
          })
          .finally(() => {
            console.info("Mounted and checked successfully.")
          })
      }
    }
    // eslint-disable react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // THis is run each time the dep array gets a hit, so set time check to false initially
    didCheckTime = false

    // fake checking for better perf
    if (!validateString()) {
      setScore(4)
      setOutput(numberToString(4).label)
    } else {
      if (password && password.length > 0) {
        checker(password)
          .then((r) => {
            setScore(r.score)
            setOutput(numberToString(r.score).label)
            console.log("Checked strength succesfully")
          })
          .catch((err) => {
            if (err instanceof Error) {
              throw new Error(err.message)
            }
            console.error(err)
          })
      }
    }
    return () => {
      didCheckTime = true
    }
  }, [password])

  enum StrengthIndicatorVariants {
    bar,
    text,
  }

  const [strengthIndicatorVariant, setStrengthIndicatorVariant] =
    useState<StrengthIndicatorVariants>(StrengthIndicatorVariants.bar)

  /**
   * Bar variant
   */
  // if (strengthIndicatorVariant === StrengthIndicatorVariants.bar) {
  //   return <StrengthBar strength={score} />
  // }

  return (
    <StrengthBar strength={score} />

    // <ErrorBoundary
    //   fallbackRender={({ error, resetErrorBoundary }) => {
    //     return <ErrorComponent error={error as unknown} resetErrorBoundary={resetErrorBoundary} />
    //   }}
    // >
    //   <Suspense
    //     fallback={
    //       <div className="strengthIndicator case5">
    //         <span>{t("strengthDefault")}</span>
    //       </div>
    //     }
    //   >
    //     <Popover>
    //       <PopoverTrigger
    //         onClick={() => {
    //           void calculateTimeToCheck().catch(console.error)
    //         }}
    //       >
    //         <TooltipProvider delayDuration={0}>
    //           <Tooltip>
    //             <TooltipTrigger type="button" asChild>
    //               <motion.div
    //                 layoutId="strengthIndicator"
    //                 key={output}
    //                 whileHover={{
    //                   scale: 1,
    //                   transition: {
    //                     type: "tween",
    //                     // duration: 0.1,
    //                   },
    //                 }}
    //                 whileTap={{ scale: 0.95 }}
    //                 whileFocus={{
    //                   scale: 0.95,
    //                   transition: {
    //                     type: "spring",
    //                   },
    //                 }}
    //                 className={`interact strengthIndicator case${score.toString()}`}
    //               >
    //                 <motion.span>{output}</motion.span>
    //               </motion.div>
    //             </TooltipTrigger>
    //             <TooltipContent sideOffset={4} className="TooltipContent">
    //               <div className="flex-center">
    //                 <OpenSelectHandGesture width={20} height={20} />
    //                 {t("moreInfo")}
    //               </div>
    //             </TooltipContent>
    //           </Tooltip>
    //         </TooltipProvider>
    //       </PopoverTrigger>
    //       <PopoverContent
    //         style={{ zIndex: 3 }}
    //         align="center"
    //         side="top"
    //         className="PopoverContent"
    //         onOpenAutoFocus={(e) => e.preventDefault()}
    //         asChild
    //       >
    //         <div className="popCard">
    //           <p className="fadeIn resultHelperText">{t("timeToCrack")}</p>
    //           <Divider margin="0.25rem 0rem" />
    //           <div className="flex-center space-between">
    //             <span>{time[0]}</span>
    //           </div>
    //         </div>
    //       </PopoverContent>
    //     </Popover>
    //   </Suspense>
    // </ErrorBoundary>
  )
}

function numberToString(value: number) {
  switch (value) {
    case 0:
      // To be able to set the state, these need to be strings
      return {
        label: t("strengthAwful").toString(),
        color: "var(--red-worst-rgb)",
      }
    case 1:
      return {
        label: t("strengthBad").toString(),
        color: "var(--orange-bad-rgb)",
      }
    case 2:
      return {
        label: t("strengthOk").toString(),
        color: "var(--yellow-ok-rgb)",
      }
    case 3:
      return {
        label: t("strengthGood").toString(),
        color: "var(--yellow-better-rgb)",
      }
    case 4:
      return {
        label: t("strengthGreat").toString(),
        color: "var(--green-go-rgb)",
      }
    default:
      return {
        label: t("strengthDefault").toString(),
        color: "var(--foreground-rgb)",
      }
  }
}

type StrengthBarProps = {
  strength: number
}

const StrengthBar = ({ strength }: StrengthBarProps) => {
  const [strengthState, setStrenthValue] = useState<number>(strength)

  useMemo(() => {
    console.log(strengthState)

    if (strengthState === strength) {
      console.log("it was same")

      return
    }
    setStrenthValue(strength)
  }, [strength])

  const percentageOfMax = (strengthState / 4) * 100

  return (
    <motion.span
      key="strengthBar"
      id="StrengthBar"
      className="StrengthBar"
      // style={{
      //   width: "0",
      // }}
      initial={{
        width: "0%",
      }}
      animate={{
        width: `${percentageOfMax}%`,
        backgroundColor: `${numberToString(strengthState).color}`,
        transition: {
          delay: 0.15,
        },
      }}
      transition={{
        delay: 0.15,
        duration: 0.6,
      }}
      exit={{
        width: 0,
        transition: {
          duration: 0.2,
        },
      }}
    ></motion.span>
  )
}
