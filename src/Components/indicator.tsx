import { FormContext, ResultContext } from "@/Components/FormContext"
import { useTranslation } from "@/common/utils/getLanguage"
import { validateLength } from "@/common/utils/helpers"
import "@/styles/Indicator.css"
import { m, useAnimate } from "framer-motion"
import { useCallback, useContext, useEffect, useState } from "react"

type StrengthBarProps = {
  strength: number
}

const checker = async (finalPassword: string) => {
  const check = await import("@/services/checkStrength").then((r) => r.checkStrength)
  return check(finalPassword.toString())
}

export function StrengthIndicator(): React.ReactNode {
  const formContext = useContext(FormContext)
  const { finalPassword } = useContext(ResultContext)
  const { passwordValue, isEdited } = finalPassword

  const {
    formState: { formValues, sliderValue },
  } = formContext
  const [score, setScore] = useState(-1)

  const validateString = useCallback(() => {
    if (!formValues.words.selected && sliderValue > 15) {
      // a rndm string needs not be checked if its longer than 15
      return false
    }
    if (formValues.words.selected && sliderValue > 3) {
      return false
    }
    return true
  }, [formValues.words.selected, sliderValue])

  useEffect(() => {
    if (isEdited && passwordValue) {
      ;async () => await checkUserInputtedString(passwordValue)
    }

    if (!validateString()) {
      setScore(4)
    } else if (passwordValue && passwordValue.length > 0) {
      ;(async () => {
        try {
          const result = await checker(passwordValue)
          setScore(result.score)
        } catch (error) {
          console.error("Error checking password strength:", error)
          setScore(-1)
        }
      })()
    }
  }, [passwordValue, isEdited, validateString])

  async function checkUserInputtedString(str: string) {
    const validatedLengthString = validateLength(str, 128)
    const r = await checker(validatedLengthString)
    setScore(r.score)
  }

  return (
    <div className="IslandContent PillIsland">
      <StrengthBar strength={score} />
    </div>
  )
}

const StrengthBar = ({ strength }: StrengthBarProps) => {
  // If percentage is 0, it would move the bar too much left, so 10 is the minimum
  const percentageOfMax = Math.max(15, (strength / 4) * 100)

  const widthOffset = 15
  const barWidthOver100 = widthOffset * 2
  const barWidth = 100 + barWidthOver100
  const [scope, animate] = useAnimate()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    animate(
      scope.current,
      { filter: "blur(0px)", opacity: 1, translateX: `-${widthOffset}%` },
      { delay: 0.3, duration: 0.85 },
    )
  }, [])
  return (
    <m.span
      ref={scope}
      key="strengthBar"
      id="StrengthBar"
      className="StrengthBar"
      style={{
        left: "10%",
        width: `${barWidth}%`,
        willChange: "transform, opacity",
      }}
      initial={{
        opacity: 0,
        filter: "blur(10px)",
        translateX: `-${70 + widthOffset}%`,
      }}
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
    />
  )
}

function numberToString(value: number) {
  const { t } = useTranslation()
  switch (value) {
    case 0:
      // To be able to set the state, these need to be strings
      return {
        label: t("strengthAwful").toString(),
        color: "rgb(180, 0, 10)",
      }
    case 1:
      return {
        label: t("strengthBad").toString(),
        color: "rgb(220, 60, 60)",
      }
    case 2:
      return {
        label: t("strengthOk").toString(),
        color: "rgb(240, 173, 78)",
      }
    case 3:
      return {
        label: t("strengthGood").toString(),
        color: "rgb(117, 215, 93)",
      }
    case 4:
      return {
        label: t("strengthGreat").toString(),
        color: "rgb(108, 241, 109)",
      }
    case -1:
      return {
        label: t("loadingStrength").toString(),
        color: "var(--background-hex)",
      }
    default:
      return {
        label: t("strengthDefault").toString(),
        color: "",
      }
  }
}
