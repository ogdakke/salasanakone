import { FormContext } from "@/Components/FormContext"
import { t, validateLength } from "@/common/utils"
import "@/styles/Indicator.css"
import { motion, useAnimate } from "framer-motion"
import { useCallback, useContext, useEffect, useState } from "react"

type StrengthBarProps = {
  strength: number
}

const checker = async (password: string) => {
  const check = await import("../services/checkStrength").then((r) => r.checkStrength)
  return check(password.toString())
}

let didInit = false
let didCheckTime = false

export function StrengthIndicator(): React.ReactNode {
  const context = useContext(FormContext)
  const password = context.formState.finalPassword

  const {
    formState: { formValues, sliderValue },
  } = context

  const validateString = useCallback(() => {
    if (!formValues.words.selected && sliderValue > 15) {
      // a rndm string needs not be checked if its longer than 15
      return false
    } else if (formValues.words.selected && sliderValue > 4) {
      return false
    }
    return true
  }, [formValues, sliderValue])
  const [score, setScore] = useState(4)

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
    } else {
      if (password && password.length > 0) {
        checker(password)
          .then((r) => {
            setScore(r.score)
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

  return (
    <div className="IslandContent PillIsland">
      <StrengthBar strength={score} />
    </div>
  )
}

const StrengthBar = ({ strength }: StrengthBarProps) => {
  const percentageOfMax = (strength / 4) * 100
  const widthOffset = 15
  const barWidthOver100 = widthOffset * 2
  const barWidth = 100 + barWidthOver100
  const [scope, animate] = useAnimate()

  useEffect(() => {
    void animate(
      scope.current,
      { filter: "blur(0px)", opacity: 1, translateX: `-${widthOffset}%` },
      { delay: 0.3, duration: 0.85 },
    )
  }, [])
  return (
    <motion.span
      ref={scope}
      key="strengthBar"
      id="StrengthBar"
      className="StrengthBar"
      style={{
        left: "10%",
        width: `${barWidth}%`,
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, filter: "blur(10px)", translateX: `-${70 + widthOffset}%` }}
      animate={{
        translateX: `-${100 - percentageOfMax + widthOffset}%`,
        backgroundColor: numberToString(strength).color,
        transition: {
          type: "spring",
          damping: 15,
          duration: 0.2,
          delay: 0.1,
        },
      }}
    ></motion.span>
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

