import { strengthToColorAndLabel } from "@/common/utils/helpers"
import "@/styles/Indicator.css"
import { motion } from "framer-motion"

export function StrengthIndicator({ score }: { score: number }): React.ReactNode {
  // If percentage is 0, it would move the bar too much left, so 15 is the minimum
  const percentageOfMax = Math.max(15, (score / 4) * 100)
  const widthOffset = 5
  const barWidthOver100 = widthOffset * 2
  const barWidth = 100 + barWidthOver100
  const move = 100 - percentageOfMax + widthOffset
  const { color } = strengthToColorAndLabel(score)

  return (
    <div className="IslandContent PillIsland">
      <motion.span
        className="StrengthBar"
        data-score={score}
        style={{
          left: "0%",
          width: `${barWidth}%`,
          willChange: "transform",
        }}
        initial={{
          opacity: 0,
          translateX: `-${70 + widthOffset}%`,
        }}
        animate={{
          translateX: `-${move}%`,
          // bugfix
          backgroundColor: color,
          opacity: 1,
          transition: {
            type: "spring",
            damping: 13,
            duration: 0.2,
          },
        }}
      />
    </div>
  )
}
