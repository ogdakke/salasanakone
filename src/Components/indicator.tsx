import { FormContext, ResultContext } from "@/Components/FormProvider"
import { t, validateLength } from "@/common/utils"
import { FormState, ResultState } from "@/models"
import "@/styles/Indicator.css"
import { motion, useAnimate } from "framer-motion"
import { useCallback, useContext, useEffect, useState } from "react"

type StrengthBarProps = {
  strength: number
}
const waitForcheck = await import("../services/checkStrength")
const check = waitForcheck.checkStrength

const checker = (finalPassword: string) => {
  try {
    return check(finalPassword.toString())
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in checking", error)
    }
  }
}

export function StrengthIndicator(): React.ReactNode {
  const formContext = useContext(FormContext)
  const result = useContext(ResultContext).finalPassword
  const { formState } = formContext

  const [score, setScore] = useState(-1)
  const checkDelay = 800

  const shouldCheckPassphrase = (form: FormState) =>
    form.formValues.words.selected && form.sliderValue < 4
  const shouldCheckPassword = (form: FormState) =>
    !form.formValues.words.selected && form.sliderValue < 16

  const checkStrengthOnChange = useCallback((passwordResult: ResultState, form: FormState) => {
    const { passwordValue, isEdited } = passwordResult
    const allowedLengths = { generated: 100, isEdited: 128 }

    console.log(passwordValue)

    if (passwordValue && (shouldCheckPassphrase(form) || shouldCheckPassword(form))) {
      const validatedLengthString = isEdited
        ? validateLength(passwordValue, allowedLengths.isEdited)
        : validateLength(passwordValue, allowedLengths.generated)
      const checkResult = checker(validatedLengthString)
      if (!checkResult) {
        throw new Error("Checking-error")
      }
      setScore(checkResult?.score)
      console.log("Time to check", checkResult.calcTime)

      return
    }
  }, [])

  useEffect(() => {
    const checkerTimer = setTimeout(() => checkStrengthOnChange(result, formState), checkDelay)

    return () => clearTimeout(checkerTimer)
  }, [result, checkStrengthOnChange])

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

