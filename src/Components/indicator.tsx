import { FormContext, ResultContext } from "@/Components/providers/FormProvider"
import { t, validateLength } from "@/common/utils"
import { FormState, ResultState } from "@/models"
import "@/styles/Indicator.css"
import { ZxcvbnResult } from "@zxcvbn-ts/core"
import { motion, useAnimate } from "framer-motion"
import { useCallback, useContext, useEffect, useRef, useState } from "react"

type StrengthBarProps = {
  strength: number
}

const checker = async (finalPassword: string) => {
  const check = await import("@/services/checkStrength").then((r) => r.checkStrength)
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

  const checkDelay = 400

  const shouldCheckPassphrase = (form: FormState) =>
    form.formValues.words.selected && form.sliderValue < 4
  const shouldCheckPassword = (form: FormState) =>
    !form.formValues.words.selected && form.sliderValue < 16

  const checkResult = useRef<ZxcvbnResult | undefined>(undefined)

  const checkStrengthOnChange = useCallback(
    async (passwordResult: ResultState, form: FormState) => {
      const { passwordValue, isEdited } = passwordResult
      const allowedLengths = { generated: 100, isEdited: 128 }

      async function runAndSetCheck(strToCheck: string) {
        const res = await checker(validateLength(strToCheck, allowedLengths.isEdited))
        checkResult.current = checkForInvalidCheckResult(res)
        setScore(checkResult.current.score)
      }

      if (passwordValue) {
        if (isEdited) {
          await runAndSetCheck(passwordValue)
        } else if (shouldCheckPassphrase(form) || shouldCheckPassword(form)) {
          await runAndSetCheck(passwordValue)
        } else {
          setScore(4)
        }
      }
    },
    [],
  )

  function checkForInvalidCheckResult(result?: ZxcvbnResult) {
    if (!result) {
      throw new Error("Check error")
    }
    return result
  }

  useEffect(() => {
    if (result.isEdited) {
      return void checkStrengthOnChange(result, formState)
    } else {
      const checkerTimer = setTimeout(
        () => void checkStrengthOnChange(result, formState).then((res) => res),
        checkDelay,
      )
      return () => clearTimeout(checkerTimer)
    }
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

