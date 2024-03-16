import { useTranslation } from "@/common/utils/getLanguage"
import { m } from "framer-motion"

type StrengthBarProps = {
  strength: number
}

export function StrengthIndicator({ score }: { score: number }): React.ReactNode {
  // If percentage is 0, it would move the bar too much left, so 15 is the minimum
  const percentageOfMax = Math.max(15, (score / 4) * 100)
  const widthOffset = 15
  const barWidthOver100 = widthOffset * 2
  const barWidth = 100 + barWidthOver100
  const move = 100 - percentageOfMax + widthOffset

  return (
    <div className="IslandContent PillIsland">
      <m.span
        className="StrengthBar"
        style={{
          left: "6%",
          width: `${barWidth}%`,
          willChange: "transform, opacity",
        }}
        initial={{
          opacity: 0,
          filter: "blur(16px)",
          translateX: `-${70 + widthOffset}%`,
        }}
        animate={{
          translateX: `-${move}%`,
          backgroundColor: numberToString(score).color,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            damping: 15,
            duration: 0.2,
            delay: 0.1,
          },
        }}
      />
    </div>
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
