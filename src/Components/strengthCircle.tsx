import { useTranslation } from "@/common/hooks/useLanguage"
import { strengthToColorAndLabel } from "@/common/utils/helpers"
import "@/styles/StrengthCircle.css"
import { motion } from "framer-motion"

export function StrengthCircle({ score }: { score: number }) {
  const { t } = useTranslation()

  const { color } = strengthToColorAndLabel(score)
  const percentageOfMax = Math.max(6, (score / 4) * 100)

  return (
    <motion.svg className="StrengthCircle" viewBox="0 0 36 36" initial="hidden" animate="animate">
      <title>{t("scoreDescription", { score: score.toString() })}</title>
      <path
        style={{ color: "#000" }}
        className=""
        d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
        fill="none"
        stroke="currentColor"
        strokeDasharray="100, 100"
        strokeWidth="4"
      />
      <motion.path
        animate={{ stroke: color, strokeDasharray: `${percentageOfMax}, 100` }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 12,
        }}
        d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
        fill="none"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </motion.svg>
  )
}
