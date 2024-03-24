import { useTranslation } from "@/common/hooks/useLanguage"
import { strengthToColorAndLabel } from "@/common/utils/helpers"
import "@/styles/StrengthCircle.css"
import { motion } from "framer-motion"

export function StrengthCircle({ score }: { score: number }) {
  const { t } = useTranslation()

  const { color } = strengthToColorAndLabel(score)
  const percentageOfMax = Math.max(8, (score / 4) * 110)

  return (
    <motion.svg className="StrengthCircle" viewBox="0 0 36 36">
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
        initial={{ strokeDasharray: "0, 100" }}
        animate={{ stroke: color, strokeDasharray: `${percentageOfMax}, 100` }}
        transition={{ type: "spring", stiffness: 100, damping: 14 }}
        d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
        fill="none"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </motion.svg>
  )
}
