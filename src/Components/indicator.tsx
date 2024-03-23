import { strengthToColorAndLabel } from "@/common/utils/helpers"
import { m } from "framer-motion"

export function StrengthIndicator({ score }: { score: number }): React.ReactNode {
  // If percentage is 0, it would move the bar too much left, so 15 is the minimum
  const percentageOfMax = Math.max(15, (score / 4) * 100)
  const widthOffset = 15
  const barWidthOver100 = widthOffset * 2
  const barWidth = 100 + barWidthOver100
  const move = 100 - percentageOfMax + widthOffset
  const { color } = strengthToColorAndLabel(score)

  return (
    <div className="IslandContent PillIsland">
      <m.span
        className="StrengthBar"
        style={{
          left: "6%",
          width: `${barWidth}%`,
          willChange: "transform",
        }}
        initial={{
          opacity: 0,
          filter: "blur(16px)",
          translateX: `-${70 + widthOffset}%`,
        }}
        animate={{
          translateX: `-${move}%`,
          backgroundColor: color,
          opacity: 1,
          filter: "blur(0)",
          transition: {
            type: "spring",
            damping: 15,
            duration: 0.2,
            delay: 0.1,
            filter: { type: "tween" },
          },
        }}
      />
    </div>
  )
}
